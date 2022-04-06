import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { NFTController } from './nft.controller';
import { NftSchema } from './nft.schema';
import { NftService } from './nft.service';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'Nft',
        schema: NftSchema,
      },
    ]),
  ],
  providers: [NftService],
  controllers: [NFTController],
})
export class NFTModule {}
