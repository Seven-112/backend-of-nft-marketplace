import { Logger, UseGuards } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import * as AWS from 'aws-sdk';
import { Server, Socket } from 'socket.io';
import { SocketAuthGuard } from 'src/guard/socket.guard';
import { NotifyGroupDTO } from '../notification/DTO/notifyGroup.dto';
import { UserService } from '../user/user.service';

@WebSocketGateway({
  namespace: 'socket',
  cors: { origin: '*' },
  transports: ['websocket'],
  reconnect: true,
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger();

  constructor(private readonly userService: UserService) {}

  @UseGuards(SocketAuthGuard)
  @SubscribeMessage('sendNoti')
  async handleMessage(client: Socket, payload: NotifyGroupDTO) {
    try {
      console.log(payload);
      const params = {
        TopicArn: process.env.AWS_SNS_TOPIC_ARN,
        Message: JSON.stringify({ ...payload }),
      };
      const sns = await new AWS.SNS().publish(params).promise();

      if (sns.$response.error) throw sns.$response.error;

      console.log(
        `Message ${params.Message} sent to the topic ${params.TopicArn}`,
      );
    } catch (error) {
      console.log(error);
    }

    // this.server.emit('msgToClient', payload);
  }

  @OnEvent('noti.created')
  handleEmitMessage(payload: any) {
    this.server.to(payload.receiver).emit('notiCreated', payload);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  async handleConnection(client: Socket, ...args: any[]) {
    const user = await this.userService.getUserFromCognito(
      client.handshake.headers.authorization.split(' ')[1],
    );

    if (user) {
      this.logger.log('Client connected:', client.id);
      client.join((user as any).sub);
    } else {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log('Client disconnected:', client.id);
  }
}
