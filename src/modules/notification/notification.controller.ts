import { Body, Controller, Get, Post } from '@nestjs/common';
import { Public } from 'src/guard/jwt-auth.guard';
import {
  SNSClient,
  GetTopicAttributesCommand,
  PublishCommand,
  SubscribeCommand,
} from '@aws-sdk/client-sns';

@Controller()
export class NotificationController {
  snsClient: SNSClient;

  constructor() {
    this.snsClient = new SNSClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  @Public()
  @Get('/noti')
  async createMessage() {
    try {
      // send message
      const params = {
        Message: 'Hello',
        TopicArn: 'arn:aws:sns:eu-west-2:565352093069:Test',
      };
      const data = await this.snsClient.send(new PublishCommand(params));

      console.log(data);

      return data;
    } catch (error) {
      console.log(error.stack);
    }
  }

  @Public()
  @Post('/noti/phone')
  async subscribePhone(@Body() body: { phone: string }) {
    try {
      const data = await this.snsClient.send(
        new SubscribeCommand({
          Protocol: 'SMS',
          TopicArn: 'arn:aws:sns:eu-west-2:565352093069:Test',
          Endpoint: body.phone,
        }),
      );

      return data;
    } catch (error) {
      console.log(error.stack);
    }
  }
}
