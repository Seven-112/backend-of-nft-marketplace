import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotifyGroupDTO } from '../notification/DTO/notifyGroup.dto';
import { UserService } from '../user/user.service';
export declare class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly userService;
    server: Server;
    private logger;
    constructor(userService: UserService);
    handleMessage(client: Socket, payload: NotifyGroupDTO): Promise<void>;
    handleEmitMessage(payload: any): void;
    afterInit(server: Server): void;
    handleConnection(client: Socket, ...args: any[]): Promise<void>;
    handleDisconnect(client: Socket): void;
}
