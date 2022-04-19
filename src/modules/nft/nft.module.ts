import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { NotificationModule } from '../notification/notification.module';
import { UserModule } from '../user/user.module';
import { NFTController } from './nft.controller';
import { NftSchema } from './nft.schema';
import { NftService } from './nft.service';
import { UserNFTBoughtSchema } from './userNFTBought.schema';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'Nft',
        schema: NftSchema,
      },
      {
        name: 'UserNFTBought',
        schema: UserNFTBoughtSchema,
      },
    ]),
    UserModule,
    NotificationModule
  ],
  providers: [NftService],
  controllers: [NFTController],
})
export class NFTModule {}
