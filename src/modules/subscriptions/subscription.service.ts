import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Subscription } from './subscription.interface';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel('Subscription')
    private readonly subscriptionModel: Model<Subscription, Subscription['id']>,
  ) {}

  async create(subscription: Subscription) {
    return this.subscriptionModel.create(subscription);
  }

  async get(limit: number, lastKey: object) {
    if(lastKey) {
      return this.subscriptionModel.scan().startAt(lastKey).limit(limit).exec();
    }

    return this.subscriptionModel.scan().limit(limit).exec();
  }

  async getSubscriptionDetail(id: string) {
    return this.subscriptionModel.get(id);
  }

  async delete(id: string) {
    return this.subscriptionModel.delete(id);
  }
}
