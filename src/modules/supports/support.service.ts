import { Injectable } from '@nestjs/common';
import { SortOrder } from 'dynamoose/dist/General';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Support, SupportKey } from './support.interface';
import * as dynamoose from 'dynamoose';
@Injectable()
export class SupportService {
  constructor(
    @InjectModel('Supports')
    private readonly supportModel: Model<Support, SupportKey>,
  ) {}

  async create(support: Support) {
    return this.supportModel.create(support);
  }

  async get(limit: number, lastKey: object) {
    if(lastKey) {
      return this.supportModel.query('table').eq('support').startAt(lastKey).limit(limit).sort(SortOrder.descending).exec();
    }

    return this.supportModel.query('table').eq('support').limit(limit).sort(SortOrder.descending).exec();
  }

  async getSupportByTicket(ticket: string) {
    const supports = await (await this.supportModel.scan('ticket_uuid').eq(ticket).exec())['toJSON']();
    return supports[0] || null;
  }

  async updateSupport(table: SupportKey, data: any) {
    console.log(data);
    delete data.createdAt;
    delete data.updatedAt;
    data.timestamp = new Date().getTime();
    this.supportModel.delete(table);
    this.supportModel.create(data);
  }
}

