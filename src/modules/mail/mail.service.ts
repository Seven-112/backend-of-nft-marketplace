import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../user/user.interface';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    // private readonly redisCacheService: RedisCacheService,
  ) {}

  async sendForgotPasswordEmail(user: User) {
    const otp = this.generateOTP();

    // this.redisCacheService.set(user.email, '' + otp, 300);

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Forgot password email',
      text: 'Sample email',
      html: `OTP here ${otp}`,
    });
  }

  generateOTP() {
    return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  }
}
