import { SNSClient } from '@aws-sdk/client-sns';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Notification } from './notification.interface';
import { Model } from 'nestjs-dynamoose';
import { RedisService } from '../redis/redis.service';
export declare class NotificationService {
    private httpService;
    private notificationModel;
    private redisService;
    snsClient: SNSClient;
    constructor(httpService: HttpService, notificationModel: Model<Notification, Notification['MessageId']>, redisService: RedisService);
    callGetApi(url: any): Promise<Observable<AxiosResponse<any, any>>>;
    createNotification(notification: Notification): Promise<import("nestjs-dynamoose").Document<Notification>>;
    getAllNotification(): Promise<import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<Notification>>>;
    getNotificationById(id: string): Promise<import("nestjs-dynamoose").Document<Notification>>;
    getAllNotificationRedis(userId: string): Promise<any[]>;
}
