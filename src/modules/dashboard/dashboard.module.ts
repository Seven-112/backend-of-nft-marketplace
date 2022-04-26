import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { EventModule } from '../event/event.module';
import { NFTModule } from '../nft/nft.module';
import { UserModule } from '../user/user.module';
import { UserController } from './dashboard.controller';
@Module({
  imports: [
    UserModule,
    NFTModule,
    EventModule
  ],
  providers: [],
  controllers: [UserController],
})
export class DashboardModule {}
