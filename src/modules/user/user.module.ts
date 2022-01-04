import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';

import { WalletModule } from '../wallet/wallet.module';
import { UserController } from './user.controller';
import { UserSchema } from './user.schema';
import { UserService } from './user.service';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
    WalletModule,
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
