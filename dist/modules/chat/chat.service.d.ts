import { Model } from 'nestjs-dynamoose';
import { Chat } from './chat.interface';
export declare class ChatService {
    private chatModel;
    constructor(chatModel: Model<Chat, Chat['userId']>);
    createChatChannel(chat: Chat): Promise<import("nestjs-dynamoose").Document<Chat>>;
    getChatByUserId(id: string): Promise<import("nestjs-dynamoose").Document<Chat>>;
    updateChat(data: Chat): Promise<import("nestjs-dynamoose").Document<Chat>>;
}
