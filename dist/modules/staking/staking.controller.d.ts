import { CreateStakingDTO } from './DTO/create-staking.dto';
import { Staking } from './staking.interface';
import { StakingService } from './staking.service';
export declare class StakingController {
    private readonly stakingService;
    constructor(stakingService: StakingService);
    createEvent(request: any, body: CreateStakingDTO): Promise<{
        code: number;
        message: string;
        data: Staking;
    }>;
    getEventAnalisys(request: any): Promise<{
        code: number;
        message: string;
        data: {
            daily: {
                data: {
                    min: number;
                    max: number;
                    pv: number;
                    name: string;
                }[];
                availableTickets: number;
                soldTickets: any;
            };
            weekly: {
                data: any;
                availableTickets: number;
                soldTickets: any;
            };
            monthly: {
                data: any;
                availableTickets: number;
                soldTickets: any;
            };
            yearly: {
                data: any;
                availableTickets: number;
                soldTickets: any;
            };
            allTime: {
                data: any;
                availableTickets: number;
                soldTickets: any;
            };
        };
    }>;
}
