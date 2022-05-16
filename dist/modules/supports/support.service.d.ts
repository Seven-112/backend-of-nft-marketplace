import { Model } from 'nestjs-dynamoose';
import { Support, SupportKey } from './support.interface';
import { RedisService } from '../redis/redis.service';
export declare class SupportService {
    private readonly supportModel;
    private readonly redisService;
    constructor(supportModel: Model<Support, SupportKey>, redisService: RedisService);
    clear(): void;
    create(support: Support): Promise<import("nestjs-dynamoose").Document<Support>>;
    get(limit: number, lastKey: {
        id: string;
    }, status: string): Promise<any>;
    getSupportByTicket(ticket: string): Promise<any>;
    updateSupport(table: SupportKey, data: any): Promise<void>;
    updateNotDelete(table: SupportKey, data: any): Promise<import("nestjs-dynamoose").Document<Support>>;
}
