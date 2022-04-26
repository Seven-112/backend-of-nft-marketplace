import { UserService } from '../user/user.service';
import { EventService } from '../event/event.service';
import { NftService } from '../nft/nft.service';
export declare class UserController {
    private userService;
    private eventService;
    private nftService;
    constructor(userService: UserService, eventService: EventService, nftService: NftService);
    dashboard(request: any): Promise<{
        code: number;
        message: string;
        data?: undefined;
    } | {
        code: number;
        message: string;
        data: {
            user: {
                percent: string;
                total: number;
            };
            event: {
                percent: string;
                total: number;
            };
            nftBought: {
                percent: string;
                total: number;
            };
        };
    }>;
}
