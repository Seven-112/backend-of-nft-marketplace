import { Model } from 'nestjs-dynamoose';
import { Support } from './support.interface';
export declare class SupportService {
    private readonly supportModel;
    constructor(supportModel: Model<Support, Support['id']>);
    create(support: Support): Promise<import("nestjs-dynamoose").Document<Support>>;
    get(limit: number, lastKey: object): Promise<import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<Support>>>;
    getSupportDetail(id: string): Promise<import("nestjs-dynamoose").Document<Support>>;
}
