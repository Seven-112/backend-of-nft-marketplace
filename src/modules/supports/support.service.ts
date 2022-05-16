import { Injectable } from '@nestjs/common';
import { SortOrder } from 'dynamoose/dist/General';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Status, Support, SupportKey } from './support.interface';
import { RedisService } from '../redis/redis.service';
import { Caching } from 'src/utils/caching';
@Injectable()
export class SupportService {
  constructor(
    @InjectModel('Supports')
    private readonly supportModel: Model<Support, SupportKey>,
    private readonly redisService: RedisService,
  ) {}

  clear() {
    this.redisService.delWithPrefix(
      Caching.ALL_SUPPORT,
      Caching.SUPPORT_BY_TICKET,
    );
  }

  async create(support: Support) {
    this.clear();
    return this.supportModel.create(support);
  }

  async get(limit: number, lastKey: { id: string }, status: string) {
    if (
      status !== Status.done &&
      status !== Status.open &&
      status !== Status.supporting
    ) {
      if (lastKey) {
        const cached = await this.redisService.getWithPrefix(
          Caching.ALL_SUPPORT,
          lastKey.id + limit + ',' + status,
        );

        if (cached) {
          return JSON.parse(cached);
        }

        const supports = await this.supportModel
          .query('table')
          .eq('support')
          .startAt(lastKey)
          .limit(limit)
          .sort(SortOrder.descending)
          .exec();

        const jsoned = await supports['toJSON']();

        if (supports.length) {
          this.redisService.setWithPrefix(
            Caching.ALL_SUPPORT,
            lastKey.id + limit + ',' + status,
            JSON.stringify(jsoned),
          );
        }

        return jsoned;
      }

      const cached = await this.redisService.getWithPrefix(
        Caching.ALL_SUPPORT,
        '' + limit + ',' + status,
      );

      if (cached) {
        return JSON.parse(cached);
      }

      const supports = await this.supportModel
        .query('table')
        .eq('support')
        .limit(limit)
        .sort(SortOrder.descending)
        .exec();

      const jsoned = await supports['toJSON']();

      if (supports.length) {
        this.redisService.setWithPrefix(
          Caching.ALL_SUPPORT,
          '' + limit + ',' + status,
          JSON.stringify(jsoned),
        );
      }

      return jsoned;
    }

    if (lastKey) {
      const cached = await this.redisService.getWithPrefix(
        Caching.ALL_SUPPORT,
        lastKey.id + status,
      );

      if (cached) {
        return JSON.parse(cached);
      }

      const supports = await this.supportModel
        .query('table')
        .eq('support')
        .and()
        .where('status')
        .eq(status)
        .startAt(lastKey)
        .limit(limit)
        .sort(SortOrder.descending)
        .exec();

      const jsoned = await supports['toJSON']();

      if (supports.length) {
        this.redisService.setWithPrefix(
          Caching.ALL_SUPPORT,
          lastKey.id + status,
          JSON.stringify(jsoned),
        );
      }

      return jsoned;
    }

    const cached = await this.redisService.getWithPrefix(
      Caching.ALL_SUPPORT,
      limit + ',' + status,
    );

    if (cached) {
      return JSON.parse(cached);
    }

    const supports = await this.supportModel
      .query('table')
      .eq('support')
      .and()
      .where('timestamp')
      .ge(0)
      .and()
      .where('status')
      .eq(status)
      .limit(limit)
      .sort(SortOrder.descending)
      .exec();

    const jsoned = await supports['toJSON']();

    if (supports.length) {
      this.redisService.setWithPrefix(
        Caching.ALL_SUPPORT,
        limit + ',' + status,
        JSON.stringify(jsoned),
      );
    }

    return jsoned;
  }

  async getSupportByTicket(ticket: string) {
    const cached = await this.redisService.getWithPrefix(
      Caching.SUPPORT_BY_TICKET,
      ticket,
    );

    if (cached) {
      return JSON.parse(cached);
    }

    const supports = await this.supportModel
      .scan('ticket_uuid')
      .eq(ticket)
      .exec();

    const jsoned = await supports['toJSON']();

    if (supports.length) {
      this.redisService.setWithPrefix(
        Caching.SUPPORT_BY_TICKET,
        ticket,
        JSON.stringify(jsoned[0]),
      );
    }

    return jsoned[0] || null;
  }

  async updateSupport(table: SupportKey, data: any) {
    data.timestamp = new Date().getTime();
    this.clear();
    this.supportModel.delete(table);
    this.supportModel.create(data);
  }

  async updateNotDelete(table: SupportKey, data: any) {
    this.clear();
    return this.supportModel.update(table, data);
  }
}
