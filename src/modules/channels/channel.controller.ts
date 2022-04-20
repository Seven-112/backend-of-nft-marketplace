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
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { CreateChannelDTO } from './DTO/createChannel.dto';
import { ChannelService } from './channel.service';
import { UserService } from '../user/user.service';
import { Channel } from './channel.interface';

@Controller('channels')
export class SupportController {
  constructor(
    private readonly channelService: ChannelService,
    private readonly userService: UserService,
  ) {}

  @Post('/')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async createEvent(@Req() request: any, @Body() body: CreateChannelDTO) {
    const to = await this.userService.getUserById(body.to)
    const from = await this.userService.getUserById(request.user.sub);

    if(!from || !to) {
      return {
        code: 400, 
        message: 'user_not_existed',
        data: null
      }
    }

    const names = [
      `${from}+${to}`,
      `${to}+${from}`,
      body.name
    ];
    let channel = await (await this.channelService.getChannelByName(names))['toJSON']();
    if(channel.length) {
      return {
        code: 200, 
        message: 'success',
        data: channel[0]
      }
    }

    const dataChannel = new Channel();
    dataChannel.from = from.id;
    dataChannel.to = to.id;
    dataChannel.name = body.name;
    dataChannel.timestamp = new Date().getTime();
    channel = await this.channelService.create(dataChannel);
    return {
      code: 201,
      message: 'channel_created',
      data: channel,
    };
  }

  @Get('/')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getSupports(@Req() request: any) {
    const user = await this.userService.getUserById(request.user.sub);

    if(!user) {
      return {
        code: 400,
        message: 'user_not_found',
        data: null
      }
    }
    let channels = await (await this.channelService.get(user.id))['populate']();
    channels = channels.map(channel => {
      if(channel.from?.id !== user.id) {
        channel.channelName = channel.from?.username || channel.from?.email;
        channel.avatar = channel.from?.avatar || null;
      }

      if(channel.to?.id !== user.id) {
        channel.channelName = channel.to?.username || channel.to?.email;
        channel.avatar = channel.to?.avatar || null;
      }
      delete channel.from;
      delete channel.to;
      return channel;
    }).sort((a, b) => {
      return b.timestamp - a.timestamp;
    });

    return {
      code: 200,
      message: 'success',
      data: channels,
    };
  }
}
