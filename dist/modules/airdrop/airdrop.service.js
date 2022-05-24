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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirdropService = void 0;
const common_1 = require("@nestjs/common");
const caching_1 = require("../../utils/caching");
const redis_service_1 = require("../redis/redis.service");
const airdrop_interface_1 = require("./airdrop.interface");
const mint_1 = require("./nft_mint/mint");
const uploader_1 = require("./arweave/uploader");
let AirdropService = class AirdropService {
    constructor(redisService) {
        this.redisService = redisService;
    }
    async mintNFT(nftId, user, userId, userNftNumber) {
        const res = await (0, uploader_1.uploadToArweave)(nftId);
        if (res) {
            await (0, mint_1.mintNewNFT)(res.name, res.symbol, res.metadataUrl, user.wallet);
            await this.redisService.set(caching_1.Caching.AIRDROP_STATUS, new airdrop_interface_1.AirdropStatus(nftId, userId, userNftNumber).toString());
        }
    }
    async getAirdropStatus() {
        const res = await this.redisService.get(caching_1.Caching.AIRDROP_STATUS);
        return airdrop_interface_1.AirdropStatus.fromString(res);
    }
};
AirdropService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService])
], AirdropService);
exports.AirdropService = AirdropService;
//# sourceMappingURL=airdrop.service.js.map