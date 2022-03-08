import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Public } from 'src/guard/jwt-auth.guard';
import { ChatService } from './chat.service';
import { CreateChatDTO } from './DTO/create-chat.DTO';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('/create')
  async create(@Body() body: CreateChatDTO) {
    const data = await this.chatService.getChatByUserId(body.userId);

    if (!data) {
      return this.chatService.createChatChannel({
        userId: body.userId,
        channels: [body.channel],
      });
    }

    return this.chatService.updateChat({
      userId: body.userId,
      channels: [...new Set([...data.channels, body.channel])],
    });
  }

  @Get('/:id')
  async getId(@Param('id') id: string) {
    return this.chatService.getChatByUserId(id);
  }
}
