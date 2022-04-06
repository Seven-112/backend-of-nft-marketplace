import { Model, Document } from 'nestjs-dynamoose';
import { Nft } from './nft.interface';
export declare class NftService {
    private nftModel;
    constructor(nftModel: Model<Nft, Nft['id']>);
    createNft(data: Omit<Nft, 'createdAt' | 'updatedAt'>): Promise<Document<Nft>>;
    getAllNfts(limit?: number): Promise<import("nestjs-dynamoose").ScanResponse<Document<Nft>>>;
    updateNft(updatedNft: Nft): Promise<Document<Nft>>;
    findNft(id: string): Promise<Document<Nft>>;
}
