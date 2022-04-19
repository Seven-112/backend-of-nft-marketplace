import { NotificationService } from './../notification/notification.service';
import { UserService } from '../user/user.service';
import { CreateNftDTO, UpdateNftDTO, BuyNFTDTO } from './DTO/nft.dto';
import { Nft } from './nft.interface';
import { NftService } from './nft.service';
export declare class NFTController {
    private readonly nftService;
    private readonly userService;
    private readonly notificationService;
    constructor(nftService: NftService, userService: UserService, notificationService: NotificationService);
    createNft(request: any, body: CreateNftDTO): Promise<{
        code: number;
        message: string;
        data: import("nestjs-dynamoose").Document<Nft>;
    }>;
    getNfts(limit?: number): Promise<{
        code: number;
        message: string;
        data: import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<Nft>>;
    }>;
    updateNft(body: UpdateNftDTO): Promise<{
        code: number;
        message: string;
        data: import("nestjs-dynamoose").Document<Nft>;
    }>;
    buyNft(request: any, id: string, body: BuyNFTDTO): Promise<{
        code: number;
        message: string;
        data?: undefined;
    } | {
        code: number;
        message: string;
        data: any;
    }>;
    getBoughtNfts(request: any, filter: string): Promise<{
        code: number;
        message: string;
        data?: undefined;
    } | {
        code: number;
        message: string;
        data: any;
    }>;
}
