import { Injectable } from '@nestjs/common';
import { InjectModel, Model, Document } from 'nestjs-dynamoose';
import { Nft } from './nft.interface';

@Injectable()
export class NftService {
  constructor(
    @InjectModel('Nft')
    private nftModel: Model<Nft, Nft['id']>,
  ) {}

  async createNft(
    data: Omit<Nft, 'createdAt' | 'updatedAt'>,
  ): Promise<Document<Nft>> {
    return this.nftModel.create(data as Nft);
  }

  async getAllNfts(limit?: number) {
    if (limit) return this.nftModel.scan().limit(limit).exec();

    return this.nftModel.scan().exec();
  }

  async updateNft(updatedNft: Nft) {
    delete updatedNft.createdAt;
    delete updatedNft.updatedAt;

    return this.nftModel.update(updatedNft);
  }

  async findNft(id: string) {
    return this.nftModel.get(id);
  }
}
