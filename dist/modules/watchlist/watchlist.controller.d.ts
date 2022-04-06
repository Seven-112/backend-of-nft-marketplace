import { UserService } from '../user/user.service';
import { UpdateWatchlistDTO } from './DTO/update-watchlist.dto';
import { WatchlistService } from './watchlist.service';
export declare class WatchlistController {
    private readonly watchlistService;
    private readonly userService;
    constructor(watchlistService: WatchlistService, userService: UserService);
    add(request: any, body: UpdateWatchlistDTO): Promise<{
        code: number;
        message: string;
        data: import("nestjs-dynamoose").Document<import("./watchlist.interface").Watchlist>;
    }>;
    remove(request: any, body: UpdateWatchlistDTO): Promise<{
        code: number;
        message: string;
        data: import("nestjs-dynamoose").Document<import("./watchlist.interface").Watchlist>;
    }>;
    get(request: any, relations?: string[]): Promise<{
        code: number;
        message: string;
        data: import("nestjs-dynamoose").Document<import("./watchlist.interface").Watchlist> | {
            id: any;
            list: any[];
        };
    }>;
}
