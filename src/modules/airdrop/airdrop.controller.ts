import {
  Body,
  Controller,
  Get,
  Post,
  Req,
} from '@nestjs/common';
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
  
  @Post('/start_airdrop')
  async startAirdrop(@Req() request: any, @Body() body: StartAirdropDTO) {
    let nftId = 0;
    for (let i = 0; i < body.userCount; i ++) {
      let u: User = body.userList[i];
      for (let j = 0; j < u.nftCount; j ++) {
        this.airdropService.mintNFT(nftId, u, i, j);
      }
    }
  }
  
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
