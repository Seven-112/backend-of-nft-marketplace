import { EStakingType } from '../staking.interface';
export declare class CreateStakingDTO {
    type: EStakingType;
    amount: number;
    wallet: string;
}
