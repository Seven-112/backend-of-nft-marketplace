import { Injectable, Query } from '@nestjs/common';
import { SortOrder } from 'dynamoose/dist/General';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Channel } from './channel.interface';
@Injectable()
export class ChannelService {
  constructor(
    @InjectModel('Channels')
    private readonly channelModel: Model<Channel, Channel['id']>,
  ) {}

  async create(support: Channel) {
    return this.channelModel.create(support);
  }

  async get(userId: string) {
    return this.channelModel.scan('from').eq(userId).or().where('to').eq(userId).exec();
  }

  async getChannelByName(names: string[]) {
    let query = this.channelModel.scan('name').eq(names[0]);
    names.forEach(name => {
      if(name !== names[0]) {
        query = query.or().where('name').eq(name)
      }
    })

    return query.exec();
  }

  async update(data: any) {
    return this.channelModel.update(data);
  }
}

