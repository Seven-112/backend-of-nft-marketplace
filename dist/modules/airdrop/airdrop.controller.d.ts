import { UserService } from '../user/user.service';
import { AirdropService } from './airdrop.service';
import { StartAirdropDTO } from './DTO/startAirdrop.dto';
export declare class AirdropController {
    private readonly airdropService;
    private readonly userService;
    constructor(airdropService: AirdropService, userService: UserService);
    startAirdrop(request: any, body: StartAirdropDTO): Promise<void>;
    getAirdropStatus(): Promise<{
        code: number;
        message: string;
        data: import("./airdrop.interface").AirdropStatus;
    }>;
}
