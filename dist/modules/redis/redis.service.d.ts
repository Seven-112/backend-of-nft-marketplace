import { Redis } from '@nestjs-modules/ioredis';
import { EListType } from './redis.interface';
export declare class RedisService {
    private readonly redis;
    constructor(redis: Redis);
    hmset(payload: any, target: EListType): Promise<void>;
    getAll(target: EListType): Promise<[Error, any]>;
}
