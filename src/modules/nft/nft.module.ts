import { Module } from '@nestjs/common';
import { NFTController } from './nft.controller';

@Module({
  providers: [],
  controllers: [NFTController],
})
export class NFTModule {}
