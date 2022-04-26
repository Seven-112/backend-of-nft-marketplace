import { Model, Document } from 'nestjs-dynamoose';
import { Nft } from './nft.interface';
import { UserNFTBought } from './userNFTBought.interface';
export declare class NftService {
    private nftModel;
    private userNFTBoughtModel;
    constructor(nftModel: Model<Nft, Nft['id']>, userNFTBoughtModel: Model<UserNFTBought, UserNFTBought['id']>);
    createNft(data: Omit<Nft, 'createdAt' | 'updatedAt'>): Promise<Document<Nft>>;
    getAllNfts(limit?: number): Promise<import("nestjs-dynamoose").ScanResponse<Document<Nft>>>;
    updateNft(updatedNft: Nft): Promise<Document<Nft>>;
    findNft(id: string): Promise<Document<Nft>>;
    createUserNftBought(data: UserNFTBought): Promise<Document<UserNFTBought>>;
    getUserNftBoughtByUserAndNft(nftId: string, userId: string): Promise<import("nestjs-dynamoose").ScanResponse<Document<UserNFTBought>>>;
    getBoughtNftByUser(userId: string, starttime: number): Promise<import("nestjs-dynamoose").ScanResponse<Document<UserNFTBought>>>;
    getDataByTime(startTime: number, endTime: number): Promise<import("nestjs-dynamoose").ScanResponse<Document<UserNFTBought>>>;
    getAllUserBought(): Promise<import("nestjs-dynamoose").ScanResponse<Document<UserNFTBought>>>;
}
