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
const SAMPLE_DATA = [
    {
        id: '1RVoIdac62lw3fObHTqG',
        name: 'Sample NFT 1',
        forSale: true,
        metadata: {
            size: 1,
        },
    },
    {
        id: 'EvbeDyZ8rCgJc9wIhFio',
        name: 'Sample NFT 2',
        forSale: true,
        metadata: {
            size: 2,
        },
    },
    {
        id: 'sRBlzh463WpY5OogqSvP',
        name: 'Sample NFT 3',
        forSale: false,
        metadata: {
            size: 3,
        },
    },
    {
        id: 'weWgMt6HNryGbvAkOp21',
        name: 'Sample NFT 4',
        forSale: true,
        metadata: {
            size: 4,
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
};
__decorate([
    (0, common_1.Get)('/getAllNFTs'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NFTController.prototype, "findAll", null);
NFTController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [])
], NFTController);
exports.NFTController = NFTController;
//# sourceMappingURL=nft.controller.js.map