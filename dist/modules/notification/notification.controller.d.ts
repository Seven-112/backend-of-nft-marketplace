import { Request } from 'express';
import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly notiService;
    constructor(notiService: NotificationService);
    subscribeTopic(req: Request): Promise<void>;
}
