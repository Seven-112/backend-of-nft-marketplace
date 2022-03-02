import { CreateTopicCommand, PublishCommand } from '@aws-sdk/client-sns';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Param,
  Post,
  Req,
  Sse,
  UsePipes,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, of } from 'rxjs';
import { Public } from 'src/guard/jwt-auth.guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { NotifyGroupDTO } from './DTO/notifyGroup.dto';
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
        // console.log(payload);

        const { userId, msg, type } = JSON.parse(payload.Message);
        // await this.notiService.createNotification(payload);
        // const allNoti = await this.notiService.getAllNotification();
        userId.forEach((id: string) => {
          this.eventService.emit(`noti.created${id}`, {
            code: 200,
            messageId: payload.MessageId,
            message: msg,
            type,
            timeStamp: payload.Timestamp,
            receiver: id,
          });
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
  @Sse('/noti/sse/:id')
  sse(@Param('id') id: string) {
    // console.log(id);
    return this.eventService.subscribe(`noti.created${id}`);
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

  @Post('/noti/user')
  @UsePipes(new ValidationPipe())
  async sendNotiToUsers(@Body() body: NotifyGroupDTO) {
    try {
      const publishText = await this.notiService.snsClient.send(
        new PublishCommand({
          TopicArn: process.env.AWS_SNS_TOPIC_ARN,
          Message: JSON.stringify({
            userId: body.userId,
            type: body.type,
            msg: body.msg,
          }),
        }),
      );
      // console.log(publishText);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
