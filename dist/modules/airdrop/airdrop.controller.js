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
exports.AirdropController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const airdrop_service_1 = require("./airdrop.service");
const startAirdrop_dto_1 = require("./DTO/startAirdrop.dto");
let AirdropController = class AirdropController {
    constructor(airdropService, userService) {
        this.airdropService = airdropService;
        this.userService = userService;
    }
    async startAirdrop(request, body) {
        let nftId = 0;
        for (let i = 0; i < body.userCount; i++) {
            let u = body.userList[i];
            for (let j = 0; j < u.nftCount; j++) {
                this.airdropService.mintNFT(nftId, u, i, j);
            }
        }
    }
    async getAirdropStatus() {
        const data = await this.airdropService.getAirdropStatus();
        return {
            code: 200,
            message: '',
            data,
        };
    }
};
__decorate([
    (0, common_1.Post)('/start_airdrop'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, startAirdrop_dto_1.StartAirdropDTO]),
    __metadata("design:returntype", Promise)
], AirdropController.prototype, "startAirdrop", null);
__decorate([
    (0, common_1.Get)('/get_airdrop_status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AirdropController.prototype, "getAirdropStatus", null);
AirdropController = __decorate([
    (0, common_1.Controller)('airdrop'),
    __metadata("design:paramtypes", [airdrop_service_1.AirdropService,
        user_service_1.UserService])
], AirdropController);
exports.AirdropController = AirdropController;
//# sourceMappingURL=airdrop.controller.js.map