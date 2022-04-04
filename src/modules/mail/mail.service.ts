import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../user/user.interface';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService
  ) {}

  async sendForgotPasswordEmail(email: string, otp: Number) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Forgot password email',
      text: 'Sample email',
      html: `OTP here ${otp}`,
    });
  }

  generateOTP() {
    return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  }
}
