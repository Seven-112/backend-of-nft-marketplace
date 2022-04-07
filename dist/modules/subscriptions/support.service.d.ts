import { Model } from 'nestjs-dynamoose';
import { Support } from './support.interface';
export declare class SupportService {
    private readonly supportModel;
    constructor(supportModel: Model<Support, Support['id']>);
    create(support: Support): Promise<any>;
    get(limit: number, lastKey: object): Promise<import("nestjs-dynamoose").ScanResponse<any>>;
    getSupportDetail(id: string): Promise<any>;
}
