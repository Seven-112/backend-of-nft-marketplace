import { Model } from 'nestjs-dynamoose';
import { Watchlist } from './watchlist.interface';
export declare class WatchlistService {
    private watchlistModel;
    constructor(watchlistModel: Model<Watchlist, Watchlist['id']>);
    update(watchlist: Watchlist): Promise<import("nestjs-dynamoose").Document<Watchlist>>;
    get(id: string): Promise<import("nestjs-dynamoose").Document<Watchlist>>;
}
