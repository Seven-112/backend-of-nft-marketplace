import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';

import { WalletSchema } from './wallet.schema';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'Wallet',
        schema: WalletSchema,
      },
    ]),
  ],
  providers: [WalletService],
  exports: [WalletService],
  controllers: [WalletController],
})
export class WalletModule {}
