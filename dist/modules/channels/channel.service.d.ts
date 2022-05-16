import { Document, Model } from 'nestjs-dynamoose';
import { RedisService } from '../redis/redis.service';
import { Channel } from './channel.interface';
export declare class ChannelService {
    private readonly channelModel;
    private readonly redisService;
    constructor(channelModel: Model<Channel, Channel['id']>, redisService: RedisService);
    clear(): void;
    create(support: Channel): Promise<Document<Channel>>;
    get(userId: string): Promise<any>;
    getChannelByName(names: string[]): Promise<any>;
    update(data: any): Promise<Document<Channel>>;
}
