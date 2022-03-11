import { Injectable } from '@nestjs/common';
import { SNSClient } from '@aws-sdk/client-sns';
import { HttpService } from '@nestjs/axios';
import { fromEvent, Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Notification } from './notification.interface';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { RedisService } from '../redis/redis.service';
import { EListType } from '../redis/redis.interface';

@Injectable()
export class NotificationService {
  snsClient: SNSClient;

  constructor(
    private httpService: HttpService,
    @InjectModel('Notification')
    private notificationModel: Model<Notification, Notification['messageId']>,
    private redisService: RedisService,
  ) {
    this.snsClient = new SNSClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async callGetApi(url: any): Promise<Observable<AxiosResponse<any, any>>> {
    return this.httpService.get(url);
  }

  async createNotification(notification: Notification) {
    return this.notificationModel.create(notification);
  }

  async deleteAllNotification() {
    const items = await this.notificationModel.scan().exec();

    const ids = items.map((item) => item.messageId);

    return this.notificationModel.batchDelete(ids);
  }

  async getAllNotification(limit: number, lastKey?: string, type?: string) {
    if (type) {
      if (lastKey) {
        return this.notificationModel
          .scan('type')
          .eq(type)
          .startAt({
            messageId: lastKey,
          })
          .limit(limit)
          .exec();
      }

      return this.notificationModel.scan('type').eq(type).limit(limit).exec();
    }

    if (lastKey) {
      return this.notificationModel
        .scan()
        .startAt({
          messageId: lastKey,
        })
        .limit(limit)
        .exec();
    }

    return this.notificationModel.scan().limit(limit).exec();
  }

  async getNotificationByReceiver(receiverId: string, type?: string) {
    if (type) {
      return this.notificationModel
        .scan('receiver')
        .eq(receiverId)
        .where('type')
        .eq(type)
        .exec();
    }

    return this.notificationModel.scan('receiver').eq(receiverId).exec();
  }

  async getAllNotificationRedis(userId: string) {
    const list = await this.redisService.getAll(EListType.notification);

    return list.filter((item) => item.userId === userId);
  }
}
