import { Redis } from '@nestjs-modules/ioredis';
import { EListType } from './redis.interface';
export declare class RedisService {
    private readonly redis;
    constructor(redis: Redis);
    hmset(payload: any, target: EListType): Promise<any>;
    getAll(target: EListType): Promise<[Error, any]>;
    setOtpForgotPassword(otp: any, email: string): Promise<"OK">;
    getOtpForgotPassword(email: string): Promise<string>;
}
