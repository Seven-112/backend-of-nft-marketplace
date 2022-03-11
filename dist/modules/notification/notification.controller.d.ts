import { Request } from 'express';
import { NotifyGroupDTO } from './DTO/notifyGroup.dto';
import { EventsService } from './events.service';
import { NotificationService } from './notification.service';
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
}
