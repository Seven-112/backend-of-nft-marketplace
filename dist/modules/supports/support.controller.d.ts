import { CreateSupportDTO } from './DTO/createSupport.dto';
import { SupportService } from './support.service';
import { Support } from './support.interface';
import { MailService } from '../mail/mail.service';
export declare class SupportController {
    private readonly supportService;
    private readonly mailService;
    constructor(supportService: SupportService, mailService: MailService);
    createEvent(request: any, body: CreateSupportDTO): Promise<{
        code: number;
        message: string;
        data: Support;
    }>;
}
