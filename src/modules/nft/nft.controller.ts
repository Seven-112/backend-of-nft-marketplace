import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { Public } from 'src/guard/jwt-auth.guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { CreateNftDTO, UpdateNftDTO } from './DTO/nft.dto';
import { Nft } from './nft.interface';
import { NftService } from './nft.service';

@Controller('nft')
export class NFTController {
  constructor(private readonly nftService: NftService) {}

  @Public()
  @Post('/create')
  @UsePipes(new ValidationPipe())
  async createNft(@Body() body: CreateNftDTO) {
    const nft = new Nft();
    Object.assign(nft, body);

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
}
