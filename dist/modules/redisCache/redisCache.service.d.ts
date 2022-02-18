import { Cache } from 'cache-manager';
export declare class RedisCacheService {
    private readonly cache;
    constructor(cache: Cache);
    get(key: string): Promise<unknown>;
    set(key: string, value: string, ttl?: number): Promise<string>;
    del(key: string): Promise<any>;
    getStore(): Promise<import("cache-manager").Store>;
}
