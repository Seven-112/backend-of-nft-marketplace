import { Model } from 'nestjs-dynamoose';
import { Channel } from './channel.interface';
export declare class ChannelService {
    private readonly channelModel;
    constructor(channelModel: Model<Channel, Channel['id']>);
    create(support: Channel): Promise<import("nestjs-dynamoose").Document<Channel>>;
    get(userId: string): Promise<import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<Channel>>>;
    getChannelByName(names: string[]): Promise<import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<Channel>>>;
    update(data: any): Promise<import("nestjs-dynamoose").Document<Channel>>;
}
