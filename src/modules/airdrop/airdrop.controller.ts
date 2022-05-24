import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, Public } from 'src/guard/jwt-auth.guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { UserService } from '../user/user.service';
import { AirdropService } from './airdrop.service';
import { StartAirdropDTO } from './DTO/startAirdrop.dto';
import { User } from './airdrop.interface';

@Controller('airdrop')
export class AirdropController {
  constructor(
    private readonly airdropService: AirdropService,
    private readonly userService: UserService,
  ) {}

  // todo: only admin can post
  @Public()
  @Post('/start_airdrop')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async startAirdrop(@Req() request: any, @Body() body: StartAirdropDTO) {
    let nftId = 0;
    console.log("body =", body);
    console.log("body userlist =", JSON.parse(body.userList));
    const userList = JSON.parse(body.userList);
    for (let i = 0; i < body.userCount; i ++) {
      console.log("i =", i);
      let u: User = userList[i];
      console.log("u =", u);
      for (let j = 0; j < u.nftCount; j ++) {
        console.log("j =", j);
        this.airdropService.mintNFT(nftId, u, i, j);
      }
    }
    return {
      code: 200,
      message: '',
      data: body
    }
  }

  @Public()
  @Get('/get_airdrop_status')
  async getAirdropStatus() {
    const data = await this.airdropService.getAirdropStatus();
    return {
      code: 200,
      message: '',
      data,
    }
  }
}
