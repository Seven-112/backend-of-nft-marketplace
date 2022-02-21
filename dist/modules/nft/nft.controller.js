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
const SAMPLE_DATA = [
    {
        id: '1RVoIdac62lw3fObHTqG',
        name: 'Sample NFT 1',
        coinPrice: 123.55,
        usdPrice: 845.55,
        forSale: true,
        metadata: {
            size: 1,
        },
    },
    {
        id: 'EvbeDyZ8rCgJc9wIhFio',
        name: 'Sample NFT 2',
        coinPrice: 123.55,
        usdPrice: 845.55,
        forSale: true,
        metadata: {
            size: 2,
        },
    },
    {
        id: 'sRBlzh463WpY5OogqSvP',
        name: 'Sample NFT 3',
        forSale: false,
        coinPrice: 123.55,
        usdPrice: 845.55,
        metadata: {
            size: 3,
        },
    },
    {
        id: 'weWgMt6HNryGbvAkOp21',
        name: 'Sample NFT 4',
        forSale: true,
        coinPrice: 123.55,
        usdPrice: 845.55,
        metadata: {
            size: 4,
        },
    },
    {
        id: '1RVoIdac62lw3fObHT2G',
        name: 'Sample NFT 5',
        forSale: true,
        coinPrice: 123.55,
        usdPrice: 845.55,
        metadata: {
            size: 1,
        },
    },
    {
        id: 'EvbeDyZ8rCgJc9wIhF3o',
        name: 'Sample NFT 6',
        forSale: true,
        coinPrice: 123.55,
        usdPrice: 845.55,
        metadata: {
            size: 2,
        },
    },
    {
        id: 'sRBlzh463WpY5OogqS4P',
        name: 'Sample NFT 7',
        forSale: false,
        coinPrice: 123.55,
        usdPrice: 845.55,
        metadata: {
            size: 3,
        },
    },
    {
        id: 'weWgMt6HNryGbvAkOp51',
        name: 'Sample NFT 8',
        forSale: true,
        coinPrice: 123.55,
        usdPrice: 845.55,
        metadata: {
            size: 4,
        },
    },
];
const PERSONAL_NFTS = [
    {
        id: 'IXG7RZ1LOVAnydFwWfHl',
        name: 'NFT Item 1',
        forSale: false,
        coinPrice: 100,
        usdPrice: 800,
        metadata: {
            size: 4,
        },
    },
    {
        id: '6v0UV9GyfxmZB52l4zOn',
        name: 'NFT Item 2',
        forSale: false,
        coinPrice: 800,
        usdPrice: 1600,
        metadata: {
            size: 2,
        },
    },
];
let NFTController = class NFTController {
    constructor() { }
    findAll(query) {
        const { filter } = query;
        return {
            code: 200,
            message: '',
            data: {
                nfts: SAMPLE_DATA,
            },
        };
    }
    getMyNFT() {
        return {
            code: 200,
            message: '',
            data: {
                nfts: PERSONAL_NFTS,
            },
        };
    }
};
__decorate([
    (0, jwt_auth_guard_1.Public)(),
    (0, common_1.Get)('/getAllNFTs'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NFTController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('/getMyNFTs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NFTController.prototype, "getMyNFT", null);
NFTController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [])
], NFTController);
exports.NFTController = NFTController;
//# sourceMappingURL=nft.controller.js.map