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
let NftService = class NftService {
    constructor(nftModel, userNFTBoughtModel) {
        this.nftModel = nftModel;
        this.userNFTBoughtModel = userNFTBoughtModel;
    }
    async createNft(data) {
        return this.nftModel.create(data);
    }
    async getAllNfts(limit) {
        if (limit)
            return this.nftModel.scan().limit(limit).exec();
        return this.nftModel.scan().exec();
    }
    async updateNft(updatedNft) {
        delete updatedNft.createdAt;
        delete updatedNft.updatedAt;
        return this.nftModel.update(updatedNft);
    }
    async findNft(id) {
        return this.nftModel.get(id);
    }
    async createUserNftBought(data) {
        return this.userNFTBoughtModel.create(data);
    }
    async getUserNftBoughtByUserAndNft(nftId, userId) {
        return this.userNFTBoughtModel.scan('nft').eq(nftId).and().where('user').eq(userId).exec();
    }
    async getBoughtNftByUser(userId, starttime) {
        return this.userNFTBoughtModel.scan('user').eq(userId).and().where('createdAt').ge(starttime).exec();
    }
};
NftService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_dynamoose_1.InjectModel)('Nft')),
    __param(1, (0, nestjs_dynamoose_1.InjectModel)('UserNFTBought')),
    __metadata("design:paramtypes", [Object, Object])
], NftService);
exports.NftService = NftService;
//# sourceMappingURL=nft.service.js.map