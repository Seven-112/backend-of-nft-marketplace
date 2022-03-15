import { BaseModel } from 'src/common/model';
export declare enum WalletType {
    phantom = "phantom",
    solflare = "solflare"
}
export declare class Wallet extends BaseModel {
    userId: string;
    address: string;
    type: string;
    constructor(userId: string, address: string, type: string);
}
