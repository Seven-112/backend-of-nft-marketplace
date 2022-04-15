import { CreateChannelDTO } from './DTO/createChannel.dto';
import { ChannelService } from './channel.service';
import { UserService } from '../user/user.service';
export declare class SupportController {
    private readonly channelService;
    private readonly userService;
    constructor(channelService: ChannelService, userService: UserService);
    createEvent(request: any, body: CreateChannelDTO): Promise<{
        code: number;
        message: string;
        data: any;
    }>;
    getSupports(request: any): Promise<{
        code: number;
        message: string;
        data: any;
    }>;
}
