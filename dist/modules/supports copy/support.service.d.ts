import { Model } from 'nestjs-dynamoose';
import { Support, SupportKey } from './support.interface';
export declare class SupportService {
    private readonly supportModel;
    constructor(supportModel: Model<Support, SupportKey>);
    create(support: Support): Promise<import("nestjs-dynamoose").Document<Support>>;
    get(limit: number, lastKey: object, status: string): Promise<import("nestjs-dynamoose").QueryResponse<import("nestjs-dynamoose").Document<Support>>>;
    getSupportByTicket(ticket: string): Promise<any>;
    updateSupport(table: SupportKey, data: any): Promise<void>;
    resolveReport(table: SupportKey, data: any): Promise<import("nestjs-dynamoose").Document<Support>>;
}
