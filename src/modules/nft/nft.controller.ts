import { NotificationService } from './../notification/notification.service';
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UsePipes,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import * as moment from 'moment';
import { JwtAuthGuard, Public } from 'src/guard/jwt-auth.guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { UserService } from '../user/user.service';
import { CreateNftDTO, UpdateNftDTO, BuyNFTDTO } from './DTO/nft.dto';
import { Nft } from './nft.interface';
import { NftService } from './nft.service';
import { UserNFTBought } from './userNFTBought.interface';
import { PublishCommand } from '@aws-sdk/client-sns';

@Controller('nft')
export class NFTController {
  constructor(
    private readonly nftService: NftService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    ) {}

  @Post('/create')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async createNft(@Req() request: any, @Body() body: CreateNftDTO) {
    const user = await this.userService.getUserById(request.user.sub);
    if(!user) {
      return {
        code: 401,
        message: 'unauthorized',
        data: null,
      }
    }
    const nft = new Nft();
    Object.assign(nft, body);
    nft.user = user.id;

    const newNft = await this.nftService.createNft(nft);

    return {
      code: 201,
      message: 'Nft created',
      data: newNft,
    };
  }

  @Public()
  @Get('/')
  async getNfts(@Query('limit') limit?: number) {
    const nfts = await this.nftService.getAllNfts(limit);

    return {
      code: 200,
      message: '',
      data: nfts,
    };
  }

  @Public()
  @Patch('/update')
  async updateNft(@Body() body: UpdateNftDTO) {
    const nft = await this.nftService.findNft(body.id);

    if (!nft) {
      return {
        code: 404,
        message: 'Nft not found',
        data: null,
      };
    }

    Object.assign(nft, body);

    const updatedNft = await this.nftService.updateNft(nft);

    return {
      code: 201,
      message: 'nft updated',
      data: updatedNft,
    };
  }

  @Post('/:id/buy')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async buyNft(@Req() request: any, @Param('id') id: string, @Body() body: BuyNFTDTO) {
    const userNftBought = new UserNFTBought();
    const user = await this.userService.getUserById(request.user.sub);
    let nft = await this.nftService.findNft(id);

    if(!nft) {
      const nftData = new Nft();
      Object.assign(nftData, body);

    nft = await this.nftService.createNft(nftData);
    }

    if(!user) {
      return {
        code: 400,
        message: 'user_not_found'
      }
    }

    if(nft.user === user.id) {
      return {
        code: 400,
        message: 'cant_buy_your_self'
      }
    }

    const checkUserBoughtNft = await (await this.nftService.getUserNftBoughtByUserAndNft(id, user.id))['toJSON']();
    if(checkUserBoughtNft.length) {
      return {
        code: 400,
        message: 'already_bought_nft'
      }
    }

    userNftBought.nft = nft;

    userNftBought.user = user;

    await this.nftService.createUserNftBought(userNftBought);
    const notificationForOwner = {
      userId: [nft.user],
      type: 'buy',
      msg: `${nft.title} has been sold`,
      sender: user.id
    }

    const notificationForBuyer = {
      userId: [user.id],
      type: 'buy',
      msg: `${nft.title} has been purchased`,
      sender: user.id
    }

    await Promise.all([
      this.notificationService.snsClient.send(
        new PublishCommand({
          TopicArn: process.env.AWS_SNS_TOPIC_ARN,
          Message: JSON.stringify(notificationForOwner),
        }),
      ),
      this.notificationService.snsClient.send(
        new PublishCommand({
          TopicArn: process.env.AWS_SNS_TOPIC_ARN,
          Message: JSON.stringify(notificationForBuyer),
        }),
      ),
    ]);

    return {
      code: 201,
      message: 'buy_nft_successful',
      data: null,
    };
  }

  @Get('/bought')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getBoughtNfts(@Req() request: any, @Query('filter') filter: string) {
    const user = await this.userService.getUserById(request.user.sub);
    let startTime = 0;


    switch(filter) {
      case 'last14Days': {
        startTime = moment().subtract(14, 'days').valueOf();
        break;
      }
      case 'last30Days': {
        startTime = moment().subtract(30, 'days').valueOf();
        break;
      }
      case 'last60Days': {
        startTime = moment().subtract(60, 'days').valueOf();
        break;
      }
      case 'last90Days': {
        startTime = moment().subtract(90, 'days').valueOf();
        break;
      }
      case 'lastYear': {
        startTime = moment().subtract(1, 'year').valueOf();
        break;
      }
      case 'allTime': {
        startTime = 0;
        break;
      }
      default: {
        startTime = moment().subtract(7, 'days').valueOf();
        break;
      }
    }
    if(!user) {
      return {
        code: 400,
        message: 'user_not_found'
      }
    }

    const boughtNfts = await (await this.nftService.getBoughtNftByUser(user.id, startTime))['populate']();

    return {
      code: 201,
      message: 'buy_nft_successful',
      data: boughtNfts,
    };
  }

  @Get('/traded-volume/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async tradedVolume(@Req() request: any, @Param('id') id: string) {
    const user = await this.userService.getUserByIdOrWallet(id);

    if(!user.length || user[0].deletedAt) {
      return {
        code: 400,
        message: 'user_not_found'
      }
    }
    let sellNfts = [];
    try {
      sellNfts = await (await this.nftService.getNftbyUser(user[0].id))['toJSON']();
    } catch(e) {
      sellNfts = [];
    }
    

    const nftIds = sellNfts.map(nft => nft.id);
    try {
      sellNfts = await (await this.nftService.getNftBoughtByNfts(nftIds))['populate']();
    } catch(e) {
      sellNfts = []
    }
    
    const totalSell = sellNfts.map(nft => +nft.nft?.price || 0)
      .reduce((prev, current) => prev + current, 0);
    
    let boughtNfts = [];
    try {
      boughtNfts = await (await this.nftService.getBoughtNftByUser(user[0].id, 0))['populate']();
      boughtNfts = await boughtNfts['toJSON']();
    } catch(e) {
      boughtNfts = [];
    }
    
    const totalBought = boughtNfts.map(nft => +nft.nft?.price || 0)
      .reduce((prev, current) => prev + current, 0);

    return {
      code: 201,
      message: 'successfull',
      data: {
        totalSell,
        totalBought
      },
    };
  }
}
