export declare class User {
    name: string;
    email: string;
    wallet: string;
    nftCount: number;
    userStatus: boolean;
}
export declare class AirdropStatus {
    totalNftNumber: number;
    curUserId: number;
    curUserNftNumber: number;
    constructor(pTotalNftNumber: any, pCurUserId: any, pCurUserNftNumber: any);
    toString(): string;
    static fromString(str: string): AirdropStatus;
}
