import { Injectable } from '@nestjs/common';
import { InjectModel, Model, Document } from 'nestjs-dynamoose';
import { Caching } from 'src/utils/caching';
import { RedisService } from '../redis/redis.service';
import { User, AirdropStatus } from './airdrop.interface';
import { mintNewNFT } from './nft_mint/mint';
import { uploadToArweave } from './arweave/uploader';

@Injectable()
export class AirdropService {
  constructor(
    private readonly redisService: RedisService,
  ) {}
  public async mintNFT(nftId: number, user: User, userId: number, userNftNumber: number) {
    const res = await uploadToArweave(nftId);
    if (res) {
      await mintNewNFT(
        res.name,
        res.symbol,
        res.metadataUrl,
        user.wallet
      )
      await this.redisService.set(
        Caching.AIRDROP_STATUS,
        new AirdropStatus(
          nftId,
          userId,
          userNftNumber
        ).toString()
      );
    }
  }

  public async getAirdropStatus() {
    const res = await this.redisService.get(Caching.AIRDROP_STATUS);
    return AirdropStatus.fromString(res);
  }
}
