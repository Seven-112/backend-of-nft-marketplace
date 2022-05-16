import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { EListType } from './redis.interface';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  getRedis() {
    return this.redis;
  }

  get(key: string) {
    return this.redis.get(key);
  }

  set(key: string, value: string) {
    return this.redis.set(key, value);
  }

  getWithPrefix(prefix: string, key: string) {
    return this.redis.get(prefix + ':' + key);
  }

  setWithPrefix(prefix: string, key: string, value: string) {
    return this.redis.set(prefix + ':' + key, value, 'EX', 5 * 60);
  }

  delWithPrefix(...prefix: string[]) {
    return prefix.map((pre) => {
      this.redis.scan('0', 'MATCH', pre + ':' + '*', (err, reply) => {
        if (err) {
          throw err;
        }

        const keys = reply[1];

        return keys.map((key) => this.redis.del(key));
      });
    });
  }

  async hmset(payload: any, target: EListType) {
    const id = nanoid();
    const data = { ...payload, isSync: false };

    await this.redis.hmset(`item:${id}`, data);
    await this.redis.lpush(target, `item:${id}`);

    return data;
  }

  async getAll(target: EListType) {
    const keys = await this.redis.lrange(target, 0, -1);

    const p = this.redis.pipeline();
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      p.hgetall(key);
    }
    const [error, data] = await p.exec();

    if (error) {
      throw error;
    }

    return data;
  }

  async setOtpForgotPassword(otp: any, email: string) {
    return await this.redis.set(`key-${email}`, otp, 'ex', 300);
  }

  async getOtpForgotPassword(email: string) {
    const otp = await this.redis.get(`key-${email}`);
    return otp;
  }
}
