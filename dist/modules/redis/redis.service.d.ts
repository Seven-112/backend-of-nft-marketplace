/// <reference types="ioredis" />
import { Redis } from '@nestjs-modules/ioredis';
import { EListType } from './redis.interface';
export declare class RedisService {
    private readonly redis;
    constructor(redis: Redis);
    getRedis(): import("ioredis").Redis;
    get(key: string): Promise<string>;
    set(key: string, value: string): Promise<"OK">;
    getWithPrefix(prefix: string, key: string): Promise<string>;
    setWithPrefix(prefix: string, key: string, value: string): Promise<"OK">;
    delWithPrefix(...prefix: string[]): Promise<number>[];
    hmset(payload: any, target: EListType): Promise<any>;
    getAll(target: EListType): Promise<[Error, any]>;
    setOtpForgotPassword(otp: any, email: string): Promise<"OK">;
    getOtpForgotPassword(email: string): Promise<string>;
}
