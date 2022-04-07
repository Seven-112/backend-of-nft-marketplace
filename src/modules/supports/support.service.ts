import { Injectable } from '@nestjs/common';
import { SortOrder } from 'dynamoose/dist/General';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Support } from './support.interface';

@Injectable()
export class SupportService {
  constructor(
    @InjectModel('Support')
    private readonly supportModel: Model<Support, Support['id']>,
  ) {}

  async create(support: Support) {
    return this.supportModel.create(support);
  }

  async get(limit: number, lastKey: object) {
    if(lastKey) {
      return this.supportModel.scan().startAt(lastKey).limit(limit).exec();
    }

    return this.supportModel.scan().limit(limit).exec();
  }

  async getSupportDetail(id: string) {
    return this.supportModel.get(id);
  }
}
