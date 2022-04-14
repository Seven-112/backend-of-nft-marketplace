import { CreateSupportDTO } from './DTO/createSupport.dto';
import { SupportService } from './support.service';
import { Support } from './support.interface';
import { MailService } from '../mail/mail.service';
import { ReplySupportDTO } from './DTO/replySupport.dto';
import { UserService } from '../user/user.service';
export declare class SupportController {
    private readonly supportService;
    private readonly mailService;
    private readonly userService;
    constructor(supportService: SupportService, mailService: MailService, userService: UserService);
    createEvent(request: any, body: CreateSupportDTO): Promise<{
        code: number;
        message: string;
        data: Support;
    }>;
    getSupports(request: any, limit?: number, lastItem?: string): Promise<{
        code: number;
        message: string;
        data: any;
    }>;
    adminReply(request: any, ticket: string, body: ReplySupportDTO): Promise<{
        code: number;
        message: string;
        data: any;
    }>;
    userReply(request: any, ticket: string, body: ReplySupportDTO): Promise<{
        code: number;
        message: string;
        data: any;
    }>;
    getSupportRequestByTicket(ticket: string): Promise<{
        code: number;
        message: string;
        data: any;
    }>;
}
