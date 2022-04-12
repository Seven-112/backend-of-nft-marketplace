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
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../guard/jwt-auth.guard");
const validation_pipe_1 = require("../../pipes/validation.pipe");
const user_service_1 = require("../user/user.service");
const nft_dto_1 = require("./DTO/nft.dto");
const nft_interface_1 = require("./nft.interface");
const nft_service_1 = require("./nft.service");
const userNFTBought_interface_1 = require("./userNFTBought.interface");
let NFTController = class NFTController {
    constructor(nftService, userService) {
        this.nftService = nftService;
        this.userService = userService;
    }
    async createNft(request, body) {
        const user = await this.userService.getUserById(request.user.sub);
        if (!user) {
            return {
                code: 401,
                message: 'unauthorized',
                data: null,
            };
        }
        const nft = new nft_interface_1.Nft();
        Object.assign(nft, body);
        nft.user = user.id;
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
    async buyNft(request, id) {
        const userNftBought = new userNFTBought_interface_1.UserNFTBought();
        const user = await this.userService.getUserById(request.user.sub);
        const nft = await this.nftService.findNft(id);
        if (!nft) {
            return {
                code: 400,
                message: 'nft_not_found'
            };
        }
        if (!user) {
            return {
                code: 400,
                message: 'user_not_found'
            };
        }
        const checkUserBoughtNft = await (await this.nftService.getUserNftBoughtByUserAndNft(id, user.id))['toJSON']();
        if (checkUserBoughtNft.length) {
            return {
                code: 400,
                message: 'already_bought_nft'
            };
        }
        userNftBought.nft = nft;
        userNftBought.user = user;
        await this.nftService.createUserNftBought(userNftBought);
        return {
            code: 201,
            message: 'buy_nft_successful',
            data: null,
        };
    }
    async getBoughtNfts(request) {
        const user = await this.userService.getUserById(request.user.sub);
        if (!user) {
            return {
                code: 400,
                message: 'user_not_found'
            };
        }
        const boughtNfts = await (await this.nftService.getBoughtNftByUser(user.id))['populate']();
        return {
            code: 201,
            message: 'buy_nft_successful',
            data: boughtNfts,
        };
    }
};
__decorate([
    (0, common_1.Post)('/create'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(new validation_pipe_1.ValidationPipe()),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, nft_dto_1.CreateNftDTO]),
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
    __metadata("design:paramtypes", [nft_dto_1.UpdateNftDTO]),
    __metadata("design:returntype", Promise)
], NFTController.prototype, "updateNft", null);
__decorate([
    (0, common_1.Post)('/:id/buy'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], NFTController.prototype, "buyNft", null);
__decorate([
    (0, common_1.Get)('/bought'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NFTController.prototype, "getBoughtNfts", null);
NFTController = __decorate([
    (0, common_1.Controller)('nft'),
    __metadata("design:paramtypes", [nft_service_1.NftService,
        user_service_1.UserService])
], NFTController);
exports.NFTController = NFTController;
//# sourceMappingURL=nft.controller.js.map