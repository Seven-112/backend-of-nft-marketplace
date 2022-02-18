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
                forSale: boolean;
                metadata: {
                    size: number;
                };
            }[];
        };
    };
}
