import { RedisService } from '../redis/redis.service';
import { User, AirdropStatus } from './airdrop.interface';
export declare class AirdropService {
    private readonly redisService;
    constructor(redisService: RedisService);
    mintNFT(nftId: number, user: User, userId: number, userNftNumber: number): Promise<void>;
    getAirdropStatus(): Promise<AirdropStatus>;
}
