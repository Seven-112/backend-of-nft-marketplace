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
exports.NFTController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../guard/jwt-auth.guard");
const validation_pipe_1 = require("../../pipes/validation.pipe");
const nft_dto_1 = require("./DTO/nft.dto");
const nft_interface_1 = require("./nft.interface");
const nft_service_1 = require("./nft.service");
let NFTController = class NFTController {
    constructor(nftService) {
        this.nftService = nftService;
    }
    async createNft(body) {
        const nft = new nft_interface_1.Nft();
        Object.assign(nft, body);
        const newNft = await this.nftService.createNft(nft);
        return {
            code: 201,
            message: 'Nft created',
            data: newNft,
        };
    }
    async getNfts(limit) {
        const nfts = await this.nftService.getAllNfts(limit);
        return {
            code: 200,
            message: '',
            data: nfts,
        };
    }
    async updateNft(body) {
        const nft = await this.nftService.findNft(body.id);
        if (!nft) {
            return {
                code: 404,
                message: 'Nft not found',
                data: null,
            };
        }
        Object.assign(nft, body);
        const updatedNft = await this.nftService.updateNft(nft);
        return {
            code: 201,
            message: 'nft updated',
            data: updatedNft,
        };
    }
};
__decorate([
    (0, jwt_auth_guard_1.Public)(),
    (0, common_1.Post)('/create'),
    (0, common_1.UsePipes)(new validation_pipe_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [nft_dto_1.CreateNftDTO]),
    __metadata("design:returntype", Promise)
], NFTController.prototype, "createNft", null);
__decorate([
    (0, jwt_auth_guard_1.Public)(),
    (0, common_1.Get)('/'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NFTController.prototype, "getNfts", null);
__decorate([
    (0, jwt_auth_guard_1.Public)(),
    (0, common_1.Patch)('/update'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NFTController.prototype, "updateNft", null);
NFTController = __decorate([
    (0, common_1.Controller)('nft'),
    __metadata("design:paramtypes", [nft_service_1.NftService])
], NFTController);
exports.NFTController = NFTController;
//# sourceMappingURL=nft.controller.js.map