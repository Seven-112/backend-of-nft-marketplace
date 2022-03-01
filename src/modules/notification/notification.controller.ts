import {
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Post,
  Req,
  Sse,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, of } from 'rxjs';
import { Public } from 'src/guard/jwt-auth.guard';
import { EventsService } from './events.service';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  constructor(
    private readonly notiService: NotificationService,
    private readonly eventService: EventsService,
  ) {}

  @Public()
  @Post('/noti')
  async subscribeTopic(@Req() req: Request) {
    try {
      const payloadStr = req.body;
      const payload = JSON.parse(payloadStr);

      if (req.header('x-amz-sns-message-type') === 'SubscriptionConfirmation') {
        const url = payload.SubscribeURL;
        const response = await this.notiService.callGetApi(url);

        await response.forEach((value) => {
          if (value.status === 200) {
            console.log('subscribed');
            return 'Yes! We have accepted the confirmation from AWS';
          } else {
            throw new HttpException('Unable to subscribe to given URL', 400);
          }
        });
      } else if (req.header('x-amz-sns-message-type') === 'Notification') {
        await this.notiService.createNotification(payload);
        const allNoti = await this.notiService.getAllNotification();
        this.eventService.emit('noti.created', {
          code: 200,
          message: '',
          data: {
            notifications: allNoti,
          },
        });
        // notication format:
        /**
         * Type: string;
         * MessageId: string;
         * TopicArn: string;
         * Subject: string;
         * Message: string;
         * Timestamp: string;
         * SignatureVersion: string;
         * Signature: string;
         * SigningCertURL: string;
         * UnsubscribeURL: string;
         */
      } else {
        throw new HttpException(`Invalid message type ${payload.Type}`, 400);
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Public()
  @Sse('/noti/sse')
  sse() {
    return this.eventService.subscribe('noti.created');
  }

  @Public()
  @Get('/noti')
  async getAllNoti() {
    const allNoti = await this.notiService.getAllNotification();
    return {
      code: 200,
      message: '',
      data: {
        notifications: allNoti,
      },
    };
  }
}
