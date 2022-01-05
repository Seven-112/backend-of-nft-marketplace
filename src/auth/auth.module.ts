import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../modules/user/user.module';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../utils/constants';
import { AuthController } from './auth.controller';
import { WalletModule } from 'src/modules/wallet/wallet.module';
import { MailModule } from 'src/modules/mail/mail.module';
import { RedisCacheModule } from 'src/modules/redisCache/redisCache.module';

@Module({
  imports: [
    UserModule,
    WalletModule,
    PassportModule,
    MailModule,
    RedisCacheModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: JWT_EXPIRES_IN },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
