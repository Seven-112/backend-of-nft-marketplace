import { Model } from 'nestjs-dynamoose';
import { Subscription } from './subscription.interface';
export declare class SubscriptionService {
    private readonly subscriptionModel;
    constructor(subscriptionModel: Model<Subscription, Subscription['id']>);
    create(subscription: Subscription): Promise<import("nestjs-dynamoose").Document<Subscription>>;
    get(limit: number, lastKey: object): Promise<import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<Subscription>>>;
    getSubscriptionDetail(id: string): Promise<import("nestjs-dynamoose").Document<Subscription>>;
    delete(id: string): Promise<void>;
}
