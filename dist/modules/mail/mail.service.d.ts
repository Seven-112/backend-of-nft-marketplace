import { MailerService } from '@nestjs-modules/mailer';
export declare class MailService {
    private readonly mailerService;
    constructor(mailerService: MailerService);
    sendForgotPasswordEmail(email: string, otp: Number): Promise<void>;
    generateOTP(): number;
}
