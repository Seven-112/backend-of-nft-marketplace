import { ChatService } from './chat.service';
import { CreateChatDTO } from './DTO/create-chat.DTO';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    create(body: CreateChatDTO): Promise<import("nestjs-dynamoose").Document<import("./chat.interface").Chat>>;
    getId(id: string): Promise<import("nestjs-dynamoose").Document<import("./chat.interface").Chat>>;
}
