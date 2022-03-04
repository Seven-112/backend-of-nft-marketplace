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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const validation_pipe_1 = require("../../pipes/validation.pipe");
const update_user_dto_1 = require("./DTO/update-user.dto");
const user_service_1 = require("./user.service");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async create(request) {
        const isUserAvailable = await this.userService.isUserAvailable(request.user.sub);
        if (!isUserAvailable) {
            return {
                code: 401,
                message: 'User not avaiable',
            };
        }
        const user = await this.userService.createUser({
            id: request.user.sub,
        });
        return {
            code: 200,
            message: '',
            data: user,
        };
    }
    async update(request, body) {
        const isWalletAvailable = await this.userService.isWalletAvailable(body.walletAddress);
        if (!isWalletAvailable) {
            return {
                code: 401,
                message: 'Wallet not avaiable',
            };
        }
        const user = await this.userService.updateUser(request.user.sub, body.walletAddress);
        return {
            code: 200,
            message: '',
            data: user,
        };
    }
    async getByWalletAddress(walletAddress) {
        const user = await this.userService.getByWalletAddress(walletAddress);
        if (!user.count) {
            return {
                code: 401,
                message: 'User not found',
            };
        }
        return {
            code: 200,
            message: '',
            data: user[0],
        };
    }
};
__decorate([
    (0, common_1.Post)('/create'),
    (0, common_1.UsePipes)(new validation_pipe_1.ValidationPipe()),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('/update'),
    (0, common_1.UsePipes)(new validation_pipe_1.ValidationPipe()),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_dto_1.UpdateUserDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('/:walletAddress'),
    __param(0, (0, common_1.Param)('walletAddress')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getByWalletAddress", null);
UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map