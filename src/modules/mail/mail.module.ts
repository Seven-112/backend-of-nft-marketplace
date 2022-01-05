import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        secure: true,
        port: '465',
        auth: {
          user: process.env.MAIL_EMAIL,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: '"No Reply" <longnguyennapa@gmail.com>',
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
