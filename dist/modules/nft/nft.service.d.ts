import { Model, Document } from 'nestjs-dynamoose';
import { RedisService } from '../redis/redis.service';
import { Nft } from './nft.interface';
import { UserNFTBought } from './userNFTBought.interface';
export declare class NftService {
    private nftModel;
    private userNFTBoughtModel;
    private readonly redisService;
    constructor(nftModel: Model<Nft, Nft['id']>, userNFTBoughtModel: Model<UserNFTBought, UserNFTBought['id']>, redisService: RedisService);
    createNft(data: Omit<Nft, 'createdAt' | 'updatedAt'>): Promise<Document<Nft>>;
    clear(): void[];
    getAllNfts(limit?: number): Promise<any>;
    updateNft(updatedNft: Nft): Promise<Document<Nft>>;
    findNft(id: string): Promise<any>;
    createUserNftBought(data: UserNFTBought): Promise<Document<UserNFTBought>>;
    getUserNftBoughtByUserAndNft(nftId: string, userId: string): Promise<any>;
    getBoughtNftByUser(userId: string, starttime: number): Promise<import("nestjs-dynamoose").ScanResponse<Document<UserNFTBought>>>;
    getDataByTime(startTime: number, endTime: number): Promise<import("nestjs-dynamoose").ScanResponse<Document<UserNFTBought>>>;
    getAllUserBought(): Promise<any>;
    getNftbyUser(id: string): Promise<any>;
    getNftBoughtByNfts(nftIds: string[]): Promise<any>;
}
