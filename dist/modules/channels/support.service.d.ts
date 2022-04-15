import { Model } from 'nestjs-dynamoose';
import { Support, SupportKey } from './support.interface';
export declare class SupportService {
    private readonly supportModel;
    constructor(supportModel: Model<Support, SupportKey>);
    create(support: Support): Promise<any>;
    get(limit: number, lastKey: object, status: string): Promise<import("nestjs-dynamoose").QueryResponse<any>>;
    getSupportByTicket(ticket: string): Promise<any>;
    updateSupport(table: SupportKey, data: any): Promise<void>;
    resolveReport(table: SupportKey, data: any): Promise<any>;
}
