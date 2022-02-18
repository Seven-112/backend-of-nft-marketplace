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
exports.WalletController = void 0;
const common_1 = require("@nestjs/common");
const dynamoose_1 = require("dynamoose");
const jwt_auth_guard_1 = require("../../guard/jwt-auth.guard");
const validation_pipe_1 = require("../../pipes/validation.pipe");
const user_interface_1 = require("../user/user.interface");
const user_service_1 = require("../user/user.service");
const addWallet_dto_1 = require("./DTO/addWallet.dto");
const removeWallet_dto_1 = require("./DTO/removeWallet.dto");
const wallet_interface_1 = require("./wallet.interface");
const wallet_service_1 = require("./wallet.service");
let WalletController = class WalletController {
    constructor(walletService, userService) {
        this.walletService = walletService;
        this.userService = userService;
    }
    async getWallet(address) {
        const wallet = await this.walletService.findByWalletAddress(address);
        if (!wallet.count) {
            throw new common_1.NotFoundException();
        }
        return wallet[0];
    }
    async addWallet(req, body) {
        try {
            const isWalletAvailable = await this.walletService.isWalletAddressAvailable(body.walletAddress);
            if (!isWalletAvailable) {
                throw new common_1.ConflictException('Wallet address is not available');
            }
            const user = req.user;
            const wallet = new wallet_interface_1.Wallet(user.id, body.walletAddress, body.walletType);
            user.wallets = [
                ...user.wallets,
                { address: body.walletAddress, type: body.walletType },
            ];
            if (!user.roles.includes(user_interface_1.UserRoles.user)) {
                user.roles.push(user_interface_1.UserRoles.user);
            }
            await (0, dynamoose_1.transaction)([
                this.walletService.createTransaction(wallet),
                this.userService.updateUserTransaction(user),
            ]);
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    async removeWallet(body) {
        try {
            const wallet = await this.walletService.findByWalletAddress(body.walletAddress);
            if (!wallet.count) {
                throw new common_1.NotFoundException();
            }
            const user = await this.userService.findById(wallet[0].userId);
            if (!user) {
                throw new common_1.NotFoundException();
            }
            user.wallets = user.wallets.filter((wallet) => wallet.address !== body.walletAddress);
            if (!user.wallets.length) {
                user.roles = user.roles.filter((role) => role !== user_interface_1.UserRoles.user);
            }
            await (0, dynamoose_1.transaction)([
                this.walletService.deleteWalletTransaction(wallet[0].id),
                this.userService.updateUserTransaction(user),
            ]);
            return user;
        }
        catch (error) {
            throw error;
        }
    }
};
__decorate([
    (0, common_1.Get)(':address'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, jwt_auth_guard_1.Public)(),
    __param(0, (0, common_1.Param)('address')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "getWallet", null);
__decorate([
    (0, common_1.Post)('/add'),
    (0, common_1.UsePipes)(new validation_pipe_1.ValidationPipe()),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, addWallet_dto_1.AddWalletDTO]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "addWallet", null);
__decorate([
    (0, common_1.Delete)('/remove'),
    (0, common_1.UsePipes)(new validation_pipe_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [removeWallet_dto_1.RemoveWalletDTO]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "removeWallet", null);
WalletController = __decorate([
    (0, common_1.Controller)('wallet'),
    __metadata("design:paramtypes", [wallet_service_1.WalletService,
        user_service_1.UserService])
], WalletController);
exports.WalletController = WalletController;
//# sourceMappingURL=wallet.controller.js.map