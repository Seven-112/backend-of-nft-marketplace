import { SubscribeDTO } from './DTO/subscribe.dto';
import { SubscriptionService } from './subscription.service';
import { MailService } from '../mail/mail.service';
export declare class SubscriptionController {
    private readonly subscriptionService;
    private readonly mailService;
    constructor(subscriptionService: SubscriptionService, mailService: MailService);
    subscribe(request: any, body: SubscribeDTO): Promise<{
        code: number;
        message: string;
    }>;
    unsubscribe(request: any, id: string): Promise<{
        code: number;
        message: string;
    }>;
}
