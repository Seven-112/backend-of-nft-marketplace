import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { ChatController } from './chat.controller';
import { ChatSchema } from './chat.schema';
import { ChatService } from './chat.service';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'Chat',
        schema: ChatSchema,
      },
    ]),
  ],
  providers: [ChatService],
  exports: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
