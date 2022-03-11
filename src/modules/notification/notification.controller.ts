import { PublishCommand } from '@aws-sdk/client-sns';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  Req,
  Sse,
  UsePipes,
} from '@nestjs/common';
import { Request } from 'express';
import { Public } from 'src/guard/jwt-auth.guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { NotifyGroupDTO } from './DTO/notifyGroup.dto';
import { EventsService } from './events.service';
import { NotificationService } from './notification.service';
import { nanoid } from 'nanoid';

@Controller('noti')
export class NotificationController {
  constructor(
    private readonly notiService: NotificationService,
    private readonly eventService: EventsService,
  ) {}

  @Public()
  @Post('/')
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

        const { userId, msg, type, sender } = JSON.parse(payload.Message);
        // const allNoti = await this.notiService.getAllNotification();
        userId.forEach((id: string) => {
          const idx = nanoid();
          const noti = {
            messageId: idx,
            message: msg,
            type,
            timeStamp: payload.Timestamp,
            receiver: id,
            sender,
          };

          // console.log(noti);

          this.notiService.createNotification(noti).then(() => {
            this.eventService.emit(`noti.created${id}`, {
              code: 200,
              ...noti,
            });
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
  @Sse('/sse/:id')
  sse(@Param('id') id: string) {
    console.log(id);
    return this.eventService.subscribe(`noti.created${id}`);
  }

  // @Public()
  // @Get('/noti')
  // async getAllNoti(
  //   @Query('limit') limit = 5,
  //   @Query('lastKey') lastKey: string,
  //   @Query('type') type: string,
  // ) {
  //   const allNoti = await this.notiService.getAllNotification(
  //     limit,
  //     lastKey,
  //     type,
  //   );

  //   return {
  //     code: 200,
  //     message: '',
  //     data: {
  //       notifications: allNoti,
  //     },
  //   };
  // }

  // @Public()
  // @Get('/noti/:id')
  // async getNotiById(
  //   @Param('id') id: string,
  //   @Query('limit') limit = 5,
  //   @Query('lastKey') lastKey: string,
  //   @Query('type') type: string,
  // ) {
  //   const allNoti = await this.notiService.getAllNotification(
  //     limit,
  //     lastKey,
  //     type,
  //   );
  //   return {
  //     code: 200,
  //     message: '',
  //     data: {
  //       notifications: allNoti.filter((noti) => noti.receiver === id),
  //     },
  //   };
  // }

  @Get('/:type')
  async getNotiByReceiver(
    @Req() req: Request,
    @Param('type') type: string,
    @Query('limit') limit = 5,
  ) {
    console.log(type);
    const decryptedUserInfo = req.user as any;
    // console.log(decryptedUserInfo);
    const allNoti = [];
    const formattedType = JSON.parse(type);

    // console.log(formattedType);

    if (formattedType.length > 0) {
      for (let i = 0; i < formattedType.length; i++) {
        const notiPerType = await this.notiService.getNotificationByReceiver(
          decryptedUserInfo.sub,
          formattedType[i],
        );

        allNoti.push(...notiPerType);
      }
    }

    return {
      code: 200,
      message: '',
      data: {
        notifications: allNoti,
      },
    };
  }

  @Post('/user')
  @UsePipes(new ValidationPipe())
  async sendNotiToUsers(@Body() body: NotifyGroupDTO) {
    try {
      const publishText = await this.notiService.snsClient.send(
        new PublishCommand({
          TopicArn: process.env.AWS_SNS_TOPIC_ARN,
          Message: JSON.stringify({ ...body }),
        }),
      );
      // console.log(publishText);
      return {
        code: 200,
        msg: 'Successfully publish message',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
