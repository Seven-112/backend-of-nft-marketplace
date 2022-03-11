import { Request } from 'express';
import { NotifyGroupDTO } from './DTO/notifyGroup.dto';
import { EventsService } from './events.service';
import { NotificationService } from './notification.service';
import { MarkReadDTO } from './DTO/markRead.dto';
export declare class NotificationController {
    private readonly notiService;
    private readonly eventService;
    constructor(notiService: NotificationService, eventService: EventsService);
    subscribeTopic(req: Request): Promise<void>;
    sse(id: string): import("rxjs").Observable<unknown>;
    getNotiByReceiver(req: Request, type: string, limit?: number): Promise<{
        code: number;
        message: string;
        data: {
            notifications: any[];
        };
    }>;
    sendNotiToUsers(body: NotifyGroupDTO): Promise<{
        code: number;
        msg: string;
    }>;
    markRead(body: MarkReadDTO): Promise<{
        code: number;
        message: string;
        data: Promise<({
            populate(): Promise<import("nestjs-dynamoose").Document<import("./notification.interface").Notification>>;
            populate(callback: import("nestjs-dynamoose").CallbackType<import("nestjs-dynamoose").Document<import("./notification.interface").Notification>, import("aws-sdk").AWSError>): void;
            populate(settings: import("dynamoose/dist/Populate").PopulateSettings): Promise<import("nestjs-dynamoose").Document<import("./notification.interface").Notification>>;
            populate(settings: import("dynamoose/dist/Populate").PopulateSettings, callback: import("nestjs-dynamoose").CallbackType<import("nestjs-dynamoose").Document<import("./notification.interface").Notification>, import("aws-sdk").AWSError>): void;
            serialize(nameOrOptions: string | import("nestjs-dynamoose").SerializerOptions): import("nestjs-dynamoose").ObjectType;
            toJSON(): import("nestjs-dynamoose").ObjectType;
            original(): import("nestjs-dynamoose").ObjectType;
        } & import("./notification.interface").Notification)[]>;
    }>;
}
