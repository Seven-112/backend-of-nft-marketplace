import { Injectable } from '@nestjs/common';
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

}
