import { MailerService } from '@nestjs-modules/mailer';
import { RedisCacheService } from '../redisCache/redisCache.service';
import { User } from '../user/user.interface';
export declare class MailService {
    private readonly mailerService;
    private readonly redisCacheService;
    constructor(mailerService: MailerService, redisCacheService: RedisCacheService);
    sendForgotPasswordEmail(user: User): Promise<void>;
    generateOTP(): number;
}
