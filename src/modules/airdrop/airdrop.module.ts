import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { UserModule } from '../user/user.module';
import { AirdropController } from './airdrop.controller';
import { AirdropService } from './airdrop.service';

@Module({
  imports: [
    UserModule,
    RedisModule,
  ],
  providers: [AirdropService],
  exports: [AirdropService],
  controllers: [AirdropController],
})
export class AirdropModule {}
