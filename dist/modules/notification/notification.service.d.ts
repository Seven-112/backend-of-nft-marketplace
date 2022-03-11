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
    constructor(httpService: HttpService, notificationModel: Model<Notification, Notification['messageId']>, redisService: RedisService);
    callGetApi(url: any): Promise<Observable<AxiosResponse<any, any>>>;
    createNotification(notification: Notification): Promise<import("nestjs-dynamoose").Document<Notification>>;
    deleteAllNotification(): Promise<import("nestjs-dynamoose").UnprocessedItems<string>>;
    getAllNotification(limit: number, lastKey?: string, type?: string): Promise<import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<Notification>>>;
    getNotificationByReceiver(receiverId: string, type?: string): Promise<import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<Notification>>>;
    getAllNotificationRedis(userId: string): Promise<any[]>;
    markRead(messageIds: string[]): Promise<({
        populate(): Promise<import("nestjs-dynamoose").Document<Notification>>;
        populate(callback: import("nestjs-dynamoose").CallbackType<import("nestjs-dynamoose").Document<Notification>, import("aws-sdk").AWSError>): void;
        populate(settings: import("dynamoose/dist/Populate").PopulateSettings): Promise<import("nestjs-dynamoose").Document<Notification>>;
        populate(settings: import("dynamoose/dist/Populate").PopulateSettings, callback: import("nestjs-dynamoose").CallbackType<import("nestjs-dynamoose").Document<Notification>, import("aws-sdk").AWSError>): void;
        serialize(nameOrOptions: string | import("nestjs-dynamoose").SerializerOptions): import("nestjs-dynamoose").ObjectType;
        toJSON(): import("nestjs-dynamoose").ObjectType;
        original(): import("nestjs-dynamoose").ObjectType;
    } & Notification)[]>;
}
