import { Request } from 'express';
import { Observable } from 'rxjs';
import { NotifyGroupDTO } from './DTO/notifyGroup.dto';
import { EventsService } from './events.service';
import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly notiService;
    private readonly eventService;
    constructor(notiService: NotificationService, eventService: EventsService);
    subscribeTopic(req: Request): Promise<void>;
    sse(id: string): Observable<unknown>;
    getAllNoti(): Promise<{
        code: number;
        message: string;
        data: {
            notifications: import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<import("./notification.interface").Notification>>;
        };
    }>;
    sendNotiToUsers(body: NotifyGroupDTO): Promise<{
        code: number;
        msg: string;
    }>;
}
