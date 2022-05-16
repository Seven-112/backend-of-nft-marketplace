"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_dynamoose_1 = require("nestjs-dynamoose");
const caching_1 = require("../../utils/caching");
const redis_service_1 = require("../redis/redis.service");
let NftService = class NftService {
    constructor(nftModel, userNFTBoughtModel, redisService) {
        this.nftModel = nftModel;
        this.userNFTBoughtModel = userNFTBoughtModel;
        this.redisService = redisService;
    }
    async createNft(data) {
        return this.nftModel.create(data);
    }
    clear() {
        return this.redisService.delWithPrefix(caching_1.Caching.ALL_NFT, caching_1.Caching.ALL_NFT_BOUGHT, caching_1.Caching.NFT_BOUGHT_BY_NFT_IDS, caching_1.Caching.NFT_BOUGHT_BY_USER_ID, caching_1.Caching.NFT_BY_ID);
    }
    async getAllNfts(limit) {
        if (limit) {
            const cached = await this.redisService.getWithPrefix(caching_1.Caching.ALL_NFT, '' + limit);
            if (cached) {
                return JSON.parse(cached);
            }
            const nfts = await this.nftModel.scan().limit(limit).exec();
            if (nfts.length) {
                this.redisService.setWithPrefix(caching_1.Caching.ALL_NFT, '' + limit, JSON.stringify(nfts));
            }
            return nfts;
        }
        const cached = await this.redisService.getWithPrefix(caching_1.Caching.ALL_NFT, '');
        if (cached) {
            return JSON.parse(cached);
        }
        const nfts = await this.nftModel.scan().exec();
        if (nfts.length) {
            this.redisService.setWithPrefix(caching_1.Caching.ALL_NFT, '', JSON.stringify(nfts));
        }
        return nfts;
    }
    async updateNft(updatedNft) {
        delete updatedNft.createdAt;
        delete updatedNft.updatedAt;
        this.clear();
        return this.nftModel.update(updatedNft);
    }
    async findNft(id) {
        const cached = await this.redisService.getWithPrefix(caching_1.Caching.NFT_BY_ID, id);
        if (cached) {
            return JSON.parse(cached);
        }
        const nft = await this.nftModel.get(id);
        if (nft) {
            this.redisService.setWithPrefix(caching_1.Caching.NFT_BY_ID, id, JSON.stringify(nft));
        }
        return nft;
    }
    async createUserNftBought(data) {
        return this.userNFTBoughtModel.create(data);
    }
    async getUserNftBoughtByUserAndNft(nftId, userId) {
        return this.userNFTBoughtModel
            .scan('nft')
            .eq(nftId)
            .and()
            .where('user')
            .eq(userId)
            .exec();
    }
    async getBoughtNftByUser(userId, starttime) {
        return this.userNFTBoughtModel
            .scan('user')
            .eq(userId)
            .and()
            .where('createdAt')
            .ge(starttime)
            .exec();
    }
    async getDataByTime(startTime, endTime) {
        return this.userNFTBoughtModel
            .scan('createdAt')
            .ge(startTime)
            .and()
            .where('createdAt')
            .le(endTime)
            .exec();
    }
    async getAllUserBought() {
        const cached = await this.redisService.getWithPrefix(caching_1.Caching.ALL_NFT_BOUGHT, '');
        if (cached) {
            return JSON.parse(cached);
        }
        const nftBoughts = await this.userNFTBoughtModel.scan().exec();
        if (nftBoughts.length) {
            this.redisService.setWithPrefix(caching_1.Caching.ALL_NFT_BOUGHT, '', JSON.stringify(nftBoughts));
        }
        return nftBoughts;
    }
    async getNftbyUser(id) {
        const cached = await this.redisService.getWithPrefix(caching_1.Caching.NFT_BOUGHT_BY_USER_ID, id);
        if (cached) {
            return JSON.parse(cached);
        }
        const nfts = await this.nftModel.scan('user').eq(id).exec();
        if (nfts.length) {
            this.redisService.setWithPrefix(caching_1.Caching.NFT_BOUGHT_BY_USER_ID, id, JSON.stringify(nfts));
        }
        return nfts;
    }
    async getNftBoughtByNfts(nftIds) {
        const cached = await this.redisService.getWithPrefix(caching_1.Caching.NFT_BOUGHT_BY_NFT_IDS, nftIds.join(','));
        if (cached) {
            return JSON.parse(cached);
        }
        const nftBoughts = await this.userNFTBoughtModel
            .scan('nft')
            .in(nftIds)
            .exec();
        if (nftBoughts.length) {
            return this.redisService.setWithPrefix(caching_1.Caching.NFT_BOUGHT_BY_NFT_IDS, nftIds.join(','), JSON.stringify(nftBoughts));
        }
        return nftBoughts;
    }
};
NftService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_dynamoose_1.InjectModel)('Nft')),
    __param(1, (0, nestjs_dynamoose_1.InjectModel)('UserNFTBought')),
    __metadata("design:paramtypes", [Object, Object, redis_service_1.RedisService])
], NftService);
exports.NftService = NftService;
//# sourceMappingURL=nft.service.js.map