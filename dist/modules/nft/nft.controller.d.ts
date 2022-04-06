import { CreateNftDTO } from './DTO/nft.dto';
import { Nft } from './nft.interface';
import { NftService } from './nft.service';
export declare class NFTController {
    private readonly nftService;
    constructor(nftService: NftService);
    createNft(body: CreateNftDTO): Promise<{
        code: number;
        message: string;
        data: import("nestjs-dynamoose").Document<Nft>;
    }>;
    getNfts(limit?: number): Promise<{
        code: number;
        message: string;
        data: import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<Nft>>;
    }>;
    updateNft(body: Partial<CreateNftDTO> & {
        id: string;
    }): Promise<{
        code: number;
        message: string;
        data: import("nestjs-dynamoose").Document<Nft>;
    }>;
}
