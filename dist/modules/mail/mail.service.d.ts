import { MailerService } from '@nestjs-modules/mailer';
export declare class MailService {
    private readonly mailerService;
    constructor(mailerService: MailerService);
    sendForgotPasswordEmail(email: string, otp: Number): Promise<void>;
    sendEmail(email: string, subject: string, content: string): Promise<void>;
    generateOTP(): number;
}
