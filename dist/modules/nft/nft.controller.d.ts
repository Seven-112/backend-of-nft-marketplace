export declare class NFTController {
    constructor();
    findAll(query: {
        filter: string;
    }): {
        code: number;
        message: string;
        data: {
            nfts: {
                id: string;
                name: string;
                coinPrice: number;
                usdPrice: number;
                forSale: boolean;
                metadata: {
                    size: number;
                };
            }[];
        };
    };
    getMyNFT(): {
        code: number;
        message: string;
        data: {
            nfts: {
                id: string;
                name: string;
                forSale: boolean;
                coinPrice: number;
                usdPrice: number;
                metadata: {
                    size: number;
                };
            }[];
        };
    };
}
