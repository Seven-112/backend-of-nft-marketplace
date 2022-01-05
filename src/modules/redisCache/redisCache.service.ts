import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get(key: string) {
    return this.cache.get(key);
  }

  async set(key: string, value: string, ttl = 300) {
    return this.cache.set(key, value, { ttl });
  }

  async del(key: string) {
    return this.cache.del(key);
  }

  async getStore() {
    return this.cache.store;
  }
}
