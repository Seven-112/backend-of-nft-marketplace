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
}
