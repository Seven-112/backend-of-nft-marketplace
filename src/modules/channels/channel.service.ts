import { Injectable, Query } from '@nestjs/common';
import { Document, InjectModel, Model } from 'nestjs-dynamoose';
import { Caching } from 'src/utils/caching';
import { RedisService } from '../redis/redis.service';
import { Channel } from './channel.interface';
@Injectable()
export class ChannelService {
  constructor(
    @InjectModel('Channels')
    private readonly channelModel: Model<Channel, Channel['id']>,
    private readonly redisService: RedisService,
  ) {}

  clear() {
    this.redisService.delWithPrefix(
      Caching.CHANNELS_BY_USER,
      Caching.CHANNEL_BY_NAMES,
    );
  }

  async create(support: Channel) {
    this.clear();
    return this.channelModel.create(support);
  }

  async get(userId: string) {
    const cached = await this.redisService.getWithPrefix(
      Caching.CHANNELS_BY_USER,
      userId,
    );

    if (cached) {
      return JSON.parse(cached);
    }

    const channels = await this.channelModel
      .scan('from')
      .eq(userId)
      .or()
      .where('to')
      .eq(userId)
      .exec();

    const populated = await channels['populate']();

    if (channels.length) {
      this.redisService.setWithPrefix(
        Caching.CHANNELS_BY_USER,
        userId,
        JSON.stringify(populated),
      );
    }

    return populated;
  }

  async getChannelByName(names: string[]) {
    const cached = await this.redisService.getWithPrefix(
      Caching.CHANNELS_BY_USER,
      names.join(','),
    );

    if (cached) {
      return JSON.parse(cached);
    }

    let query = this.channelModel.scan('name').eq(names[0]);
    names.forEach((name) => {
      if (name !== names[0]) {
        query = query.or().where('name').eq(name);
      }
    });

    const channel = await query.exec();

    const jsoned = await channel['toJSON']();

    if (channel.length) {
      this.redisService.setWithPrefix(
        Caching.CHANNEL_BY_NAMES,
        names.join(','),
        JSON.stringify(jsoned),
      );
    }

    return jsoned;
  }

  async update(data: any) {
    this.clear();
    return this.channelModel.update(data);
  }
}
