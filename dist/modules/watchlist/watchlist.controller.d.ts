import { UpdateWatchlistDTO } from './DTO/update-watchlist.dto';
import { Watchlist } from './watchlist.interface';
import { WatchlistService } from './watchlist.service';
export declare class WatchlistController {
    private readonly watchlistService;
    constructor(watchlistService: WatchlistService);
    update(request: any, body: UpdateWatchlistDTO): Promise<{
        code: number;
        message: string;
        data: import("nestjs-dynamoose").Document<Watchlist>;
    }>;
    get(request: any): Promise<{
        code: number;
        message: string;
        data: import("nestjs-dynamoose").Document<Watchlist> | {
            id: any;
            list: any[];
        };
    }>;
}
