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

  public async startAirdrop(userCount: number, userList: User[]) {
    let nftId = 0;
    for (let i = 0; i < userCount; i ++) {
      let u: User = userList[i];
      for (let j = 0; j < u.nftCount; j ++) {
        await this.mintNFT(nftId++, u, i, j);
      }
    }
  }
  
  public async mintNFT(nftId: number, user: User, userId: number, userNftNumber: number) {
    console.log("mintNFT");
    const res = await uploadToArweave(nftId);
    /*const res = {
      name: "Metaversus SpaceShip #0",
      symbol: "MTVS",
      metadataUrl: "https://arweave.net/a2XrWSHrbgF5uJlb7deQcP17BSjBYEEChc-g6UzDw9E"
    };*/
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
    console.log("status str =", res);
    return AirdropStatus.fromString(res);
  }
}
