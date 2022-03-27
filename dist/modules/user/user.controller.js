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
const Document_1 = require("dynamoose/dist/Document");
const jwt_auth_guard_1 = require("../../guard/jwt-auth.guard");
const validation_pipe_1 = require("../../pipes/validation.pipe");
const get_user_information_1 = require("./DTO/get-user-information");
const search_user_dto_1 = require("./DTO/search-user.dto");
const update_profile_1 = require("./DTO/update-profile");
const update_user_dto_1 = require("./DTO/update-user.dto");
const user_service_1 = require("./user.service");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async getUserProfile(request) {
        const user = await this.userService.getUserById(request.user.sub);
        return {
            code: 200,
            message: '',
            data: Object.assign(Object.assign({}, user), { sub: request.user.sub }),
        };
    }
    async getUserProfileFromCognito(request) {
        const accessToken = request.headers.authorization.split(' ')[1];
        const data = await this.userService.getUserFromCognito(accessToken);
        return {
            code: 200,
            message: 'Get user success',
            data,
        };
    }
    async updateProfile(request, body) {
        const user = await this.userService.getUserById(request.user.sub);
        if (!user) {
            return {
                code: 404,
                message: 'User not found',
                data: null,
            };
        }
        const isValidUsername = await this.userService.getUserByUsername(body.username);
        if (isValidUsername.count &&
            isValidUsername[0].username !== user.username) {
            return {
                code: 409,
                message: 'Username is already taken',
                data: null,
            };
        }
        Object.assign(user, body);
        const updatedUser = await this.userService.updateUser(user);
        return {
            code: 200,
            message: 'Updated',
            data: updatedUser,
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
        const updatedUser = await this.userService.updateWalletAddress(request.user.sub, body.email, body.walletAddress);
        return {
            code: 200,
            message: '',
            data: updatedUser,
        };
    }
    async getUserInformation(body) {
        const users = await this.userService.getUsers(body.userIds);
        return {
            code: 200,
            data: {
                users,
            },
        };
    }
    async getUserById(id) {
        const user = await this.userService.getUserById(id);
        return {
            code: 200,
            data: user,
        };
    }
    async search(body) {
        const users = await this.userService.searchUsers(body.address);
        if (!users.count) {
            return {
                code: 404,
                message: 'User not found',
                data: null,
            };
        }
        return {
            code: 200,
            message: '',
            data: users,
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
    (0, common_1.Get)('/profile'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserProfile", null);
__decorate([
    (0, common_1.Get)('/profile/cognito'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserProfileFromCognito", null);
__decorate([
    (0, common_1.Patch)('/profile'),
    (0, common_1.UsePipes)(new validation_pipe_1.ValidationPipe()),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Document_1.AnyDocument,
        update_profile_1.UpdateProfileDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfile", null);
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
    (0, common_1.Post)('/info'),
    (0, common_1.UsePipes)(new validation_pipe_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_user_information_1.GetUserInformationDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserInformation", null);
__decorate([
    (0, common_1.Get)('/id/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Post)('/search'),
    (0, jwt_auth_guard_1.Public)(),
    (0, common_1.UsePipes)(new validation_pipe_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_user_dto_1.SearchUserDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "search", null);
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