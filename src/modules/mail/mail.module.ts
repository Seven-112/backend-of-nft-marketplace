import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { RedisCacheModule } from '../redisCache/redisCache.module';

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
    RedisCacheModule,
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
