import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../user/user.interface';
export declare class MailService {
    private readonly mailerService;
    constructor(mailerService: MailerService);
    sendForgotPasswordEmail(user: User): Promise<void>;
    generateOTP(): number;
}
