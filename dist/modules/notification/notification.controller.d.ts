import { Request } from 'express';
import { Observable } from 'rxjs';
import { EventsService } from './events.service';
import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly notiService;
    private readonly eventService;
    constructor(notiService: NotificationService, eventService: EventsService);
    subscribeTopic(req: Request): Promise<void>;
    sse(): Observable<unknown>;
    getAllNoti(): Promise<import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<import("./notification.interface").Notification>>>;
}
