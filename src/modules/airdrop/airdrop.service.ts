import { Injectable } from '@nestjs/common';
import { InjectModel, Model, Document } from 'nestjs-dynamoose';
import { Caching } from 'src/utils/caching';
import { RedisService } from '../redis/redis.service';
import { User, AirdropStatus } from './airdrop.interface';
import { mintNewNFT } from './nft_mint/mint';
import { uploadToArweave } from './arweave/uploader';

const MAX_NFT_COUNT = 10;
@Injectable()
export class AirdropService {
  constructor(
    private readonly redisService: RedisService,
  ) {}

  public async startAirdrop(userCount: number, userList: User[]) {
    //console.log("startAirdrop userList =", userList);
    // update airdrop status
    let curState = AirdropStatus.fromString(await this.redisService.get(
      Caching.AIRDROP_STATUS
    ));
    if (!curState.isAble()) return;
    curState.setStateToDoing();
    await this.redisService.set(
      Caching.AIRDROP_STATUS,
      curState.toString()
    );

    let nftId = 0;
    for (let i = 0; i < userCount; i ++) {
      let u: User = userList[i];
      for (let j = 0; j < u.nftCount ?? 1; j ++) {
        let res = false;
        while(!res) {
          // if minting failed, try again
          res = await this.mintNFT(nftId, u, i, j);
        }
        nftId++;
      }
    }
  }
  
  public async mintNFT(nftId: number, user: User, userId: number, userNftNumber: number): Promise<boolean> {
    if (user.walletAddress && user.status === 'active') {
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
          user.walletAddress
        )
        let curState = AirdropStatus.fromString(await this.redisService.get(
          Caching.AIRDROP_STATUS
        ));
        curState.airdroppedCount ++;
        if (curState.airdroppedCount === MAX_NFT_COUNT) {
          curState.setStateToDone();
        }
        await this.redisService.set(
          Caching.AIRDROP_STATUS,
          curState.toString()
        );
        return true
      }
    }
    return false;
  }

  public async getAirdropStatus() {
    const res = await this.redisService.get(Caching.AIRDROP_STATUS);
    console.log("status str =", res);
    return AirdropStatus.fromString(res);
  }
}
