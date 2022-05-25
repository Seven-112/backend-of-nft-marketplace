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
    const userList = JSON.parse(body.userList);
    this.airdropService.startAirdrop(body.userCount, userList);
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
