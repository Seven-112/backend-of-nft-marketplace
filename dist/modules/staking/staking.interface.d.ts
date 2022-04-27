export declare enum EStakingType {
    staking = "staking",
    unstaking = "unstaking"
}
export declare class Staking {
    id: string;
    type: EStakingType;
    amount: number;
    stakedTime: number;
    wallet: string;
    constructor();
}
