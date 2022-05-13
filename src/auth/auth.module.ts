import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../modules/user/user.module';
import { MailModule } from 'src/modules/mail/mail.module';
import { RedisModule } from 'src/modules/redis/redis.module';

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
    RedisModule,
    JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
