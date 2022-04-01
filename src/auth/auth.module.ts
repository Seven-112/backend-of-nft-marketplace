import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../modules/user/user.module';
import { MailModule } from 'src/modules/mail/mail.module';
// import { RedisCacheModule } from 'src/modules/redisCache/redisCache.module';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { TwitterOauthStrategy } from './twitter.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    MailModule,
    // RedisCacheModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, TwitterOauthStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
