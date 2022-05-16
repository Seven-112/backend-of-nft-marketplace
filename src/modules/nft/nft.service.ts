import { Injectable } from '@nestjs/common';
import { InjectModel, Model, Document } from 'nestjs-dynamoose';
import { Caching } from 'src/utils/caching';
import { RedisService } from '../redis/redis.service';
import { Nft } from './nft.interface';
import { UserNFTBought } from './userNFTBought.interface';

@Injectable()
export class NftService {
  constructor(
    @InjectModel('Nft')
    private nftModel: Model<Nft, Nft['id']>,
    @InjectModel('UserNFTBought')
    private userNFTBoughtModel: Model<UserNFTBought, UserNFTBought['id']>,
    private readonly redisService: RedisService,
  ) {}

  async createNft(
    data: Omit<Nft, 'createdAt' | 'updatedAt'>,
  ): Promise<Document<Nft>> {
    return this.nftModel.create(data as Nft);
  }

  clear() {
    return this.redisService.delWithPrefix(
      Caching.ALL_NFT,
      Caching.ALL_NFT_BOUGHT,
      Caching.NFT_BOUGHT_BY_NFT_IDS,
      Caching.NFT_BOUGHT_BY_USER_ID,
      Caching.NFT_BY_ID,
      Caching.NFT_BOUGHT_BY_USER_AND_NFT,
    );
  }

  async getAllNfts(limit?: number) {
    if (limit) {
      const cached = await this.redisService.getWithPrefix(
        Caching.ALL_NFT,
        '' + limit,
      );

      if (cached) {
        return JSON.parse(cached);
      }

      const nfts = await this.nftModel.scan().limit(limit).exec();

      if (nfts.length) {
        this.redisService.setWithPrefix(
          Caching.ALL_NFT,
          '' + limit,
          JSON.stringify(nfts),
        );
      }

      return nfts;
    }

    const cached = await this.redisService.getWithPrefix(Caching.ALL_NFT, '');

    if (cached) {
      return JSON.parse(cached);
    }

    const nfts = await this.nftModel.scan().exec();

    if (nfts.length) {
      this.redisService.setWithPrefix(
        Caching.ALL_NFT,
        '',
        JSON.stringify(nfts),
      );
    }

    return nfts;
  }

  async updateNft(updatedNft: Nft) {
    delete updatedNft.createdAt;
    delete updatedNft.updatedAt;
    this.clear();
    return this.nftModel.update(updatedNft);
  }

  async findNft(id: string) {
    const cached = await this.redisService.getWithPrefix(Caching.NFT_BY_ID, id);

    if (cached) {
      return JSON.parse(cached);
    }

    const nft = await this.nftModel.get(id);

    if (nft) {
      this.redisService.setWithPrefix(
        Caching.NFT_BY_ID,
        id,
        JSON.stringify(nft),
      );
    }

    return nft;
  }

  async createUserNftBought(data: UserNFTBought) {
    this.clear();
    return this.userNFTBoughtModel.create(data);
  }

  async getUserNftBoughtByUserAndNft(nftId: string, userId: string) {
    const cached = await this.redisService.getWithPrefix(
      Caching.NFT_BOUGHT_BY_USER_AND_NFT,
      nftId + ',' + userId,
    );

    if (cached) {
      return JSON.parse(cached);
    }

    const nftBoughts = await this.userNFTBoughtModel
      .scan('nft')
      .eq(nftId)
      .and()
      .where('user')
      .eq(userId)
      .exec();

    const jsoned = await nftBoughts['toJSON']();

    if (nftBoughts.length) {
      this.redisService.setWithPrefix(
        Caching.NFT_BOUGHT_BY_USER_AND_NFT,
        nftId + ',' + userId,
        JSON.stringify(jsoned),
      );
    }

    return jsoned;
  }

  async getBoughtNftByUser(userId: string, starttime: number) {
    return this.userNFTBoughtModel
      .scan('user')
      .eq(userId)
      .and()
      .where('createdAt')
      .ge(starttime)
      .exec();
  }

  async getDataByTime(startTime: number, endTime: number) {
    return this.userNFTBoughtModel
      .scan('createdAt')
      .ge(startTime)
      .and()
      .where('createdAt')
      .le(endTime)
      .exec();
  }

  async getAllUserBought() {
    const cached = await this.redisService.getWithPrefix(
      Caching.ALL_NFT_BOUGHT,
      '',
    );

    if (cached) {
      return JSON.parse(cached);
    }

    const nftBoughts = await this.userNFTBoughtModel.scan().exec();

    if (nftBoughts.length) {
      this.redisService.setWithPrefix(
        Caching.ALL_NFT_BOUGHT,
        '',
        JSON.stringify(nftBoughts),
      );
    }

    return nftBoughts;
  }

  async getNftbyUser(id: string) {
    const cached = await this.redisService.getWithPrefix(
      Caching.NFT_BOUGHT_BY_USER_ID,
      id,
    );

    if (cached) {
      return JSON.parse(cached);
    }

    const nfts = await this.nftModel.scan('user').eq(id).exec();

    if (nfts.length) {
      this.redisService.setWithPrefix(
        Caching.NFT_BOUGHT_BY_USER_ID,
        id,
        JSON.stringify(nfts),
      );
    }

    return nfts;
  }

  async getNftBoughtByNfts(nftIds: string[]) {
    const cached = await this.redisService.getWithPrefix(
      Caching.NFT_BOUGHT_BY_NFT_IDS,
      nftIds.join(','),
    );

    if (cached) {
      return JSON.parse(cached);
    }

    const nftBoughts = await this.userNFTBoughtModel
      .scan('nft')
      .in(nftIds)
      .exec();

    if (nftBoughts.length) {
      return this.redisService.setWithPrefix(
        Caching.NFT_BOUGHT_BY_NFT_IDS,
        nftIds.join(','),
        JSON.stringify(nftBoughts),
      );
    }

    return nftBoughts;
  }
}
