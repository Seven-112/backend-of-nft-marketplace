import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Chat } from './chat.interface';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('Chat')
    private chatModel: Model<Chat, Chat['userId']>,
  ) {}

  async createChatChannel(chat: Chat) {
    return this.chatModel.create(chat);
  }

  async getChatByUserId(id: string) {
    return this.chatModel.get(id);
  }

  async updateChat(data: Chat) {
    return this.chatModel.update(data);
  }
}
