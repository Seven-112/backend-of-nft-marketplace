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
const user_interface_1 = require("./user.interface");
const swagger_1 = require("@nestjs/swagger");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async getUserProfile(request) {
        const user = await this.userService.getUserById(request.user.sub);
        if (user.deletedAt) {
            return {
                code: 400,
                message: 'user_is_deleted'
            };
        }
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
        if (user.deletedAt) {
            return {
                code: 400,
                message: 'user_is_deleted'
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
    async updateSocial(request, body) {
        let user = await this.userService.getUserById(request.user.sub);
        if (!user) {
            return {
                code: 404,
                message: 'User not found',
                data: null,
            };
        }
        if (user.deletedAt) {
            return {
                code: 400,
                message: 'user_is_deleted'
            };
        }
        Object.assign(user, body);
        user = await this.userService.updateUser(user);
        return {
            code: 200,
            message: 'Updated',
            data: user,
        };
    }
    async updatePassword(request, body) {
        try {
            const accessToken = request.headers.authorization.split(' ')[1];
            await this.userService.changePassword({
                AccessToken: accessToken,
                PreviousPassword: body.oldPassword,
                ProposedPassword: body.newPassword,
            });
            return {
                code: 201,
                message: 'Password updated',
            };
        }
        catch (error) {
            console.log('err', error);
            return {
                code: error.statusCode,
                message: error.code,
            };
        }
    }
    async update(request, body) {
        var _a, _b, _c;
        const userByEmail = await this.userService.getByEmail(body.email.toLowerCase());
        const userByWallet = await this.userService.getByWalletAddress(body.walletAddress);
        const case1 = ((_a = userByWallet === null || userByWallet === void 0 ? void 0 : userByWallet[0]) === null || _a === void 0 ? void 0 : _a.email) === body.email &&
            ((_b = userByWallet === null || userByWallet === void 0 ? void 0 : userByWallet[0]) === null || _b === void 0 ? void 0 : _b.walletAddress) === body.walletAddress;
        const case2 = !userByWallet.count && !((_c = userByEmail === null || userByEmail === void 0 ? void 0 : userByEmail[0]) === null || _c === void 0 ? void 0 : _c.walletAddress);
        if (case1 || case2) {
            const foundUser = await this.userService.getUserById(request.user.sub);
            if (foundUser.deletedAt) {
                return {
                    code: 400,
                    message: 'user_is_deleted'
                };
            }
            const updatedBody = Object.assign(Object.assign({}, body), { email: body.email.toLowerCase(), role: (foundUser === null || foundUser === void 0 ? void 0 : foundUser.role) || user_interface_1.UserRole.User, status: (foundUser === null || foundUser === void 0 ? void 0 : foundUser.status) || user_interface_1.UserStatus.active, createdAt: (foundUser === null || foundUser === void 0 ? void 0 : foundUser.createdAt) || new Date().toISOString() });
            if (updatedBody.status === user_interface_1.UserStatus.inactive) {
                await this.userService.disableUserCognito(updatedBody.email, request.user.sub);
            }
            if (updatedBody.status === user_interface_1.UserStatus.active && foundUser.status !== user_interface_1.UserStatus.active) {
                await this.userService.enableUserCognito(updatedBody.email, request.user.sub);
            }
            const updatedUser = await this.userService.updateWalletAddress(request.user.sub, updatedBody);
            return {
                code: 200,
                message: '',
                data: updatedUser,
            };
        }
        return {
            code: 400,
            message: 'Cannot update wallet',
            data: null,
        };
    }
    async updateUser(request, body) {
        const user = await this.userService.getUserById(request.user.sub);
        if (!user)
            return {
                code: 404,
                message: 'User not found',
                data: null,
            };
        if (user.deletedAt) {
            return {
                code: 400,
                message: 'user_is_deleted'
            };
        }
        if (user.role !== user_interface_1.UserRole.Admin)
            return {
                code: 403,
                message: 'Not allowed',
                data: null,
            };
        const updatedUser = await this.userService.updateUser(body);
        return {
            code: 200,
            message: 'Updated',
            data: updatedUser,
        };
    }
    async getAllAccounts(request, limit) {
        const user = await this.userService.getUserById(request.user.sub);
        if (user.role !== user_interface_1.UserRole.Admin)
            return {
                code: 403,
                message: 'Not allowed',
                data: null,
            };
        const allAccounts = await this.userService.getAllUsers(limit);
        return {
            code: 200,
            data: { accounts: allAccounts, length: allAccounts.length },
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
        const user = await this.userService.getUserByIdOrWallet(id);
        if (!user.length) {
            return {
                code: 404,
                message: 'User not found',
                data: null,
            };
        }
        if (user[0].deletedAt) {
            return {
                code: 400,
                message: 'user_is_deleted'
            };
        }
        return {
            code: 200,
            data: user[0],
        };
    }
    async search(body) {
        const users = await this.userService.searchUsers(body.address);
        return {
            code: 200,
            message: 'successful',
            data: users,
        };
    }
    async getByWalletAddress(walletAddress) {
        const user = await this.userService.getByWalletAddress(walletAddress);
        if (!user.count) {
            return {
                code: 404,
                message: 'User not found',
                data: null,
            };
        }
        return {
            code: 200,
            message: '',
            data: user[0],
        };
    }
    async delete(id) {
        let user = await (await this.userService.getUserByIdOrWallet(id))['toJSON']();
        if (!user.length) {
            return {
                code: 404,
                message: 'User not found',
                data: null,
            };
        }
        user = user[0];
        user.deletedAt = new Date().getTime();
        await this.userService.updateUser(user);
        await this.userService.disableUserCognito(user.email, user.id);
        return {
            code: 200,
            data: user[0],
        };
    }
};
__decorate([
    (0, common_1.Get)('/profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserProfile", null);
__decorate([
    (0, common_1.Get)('/profile/cognito'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserProfileFromCognito", null);
__decorate([
    (0, common_1.Patch)('/profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UsePipes)(new validation_pipe_1.ValidationPipe()),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Document_1.AnyDocument,
        update_profile_1.UpdateProfileDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Patch)('/socials'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UsePipes)(new validation_pipe_1.ValidationPipe()),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_1.UpdateSocialDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateSocial", null);
__decorate([
    (0, common_1.Patch)('/password'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UsePipes)(new validation_pipe_1.ValidationPipe()),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Document_1.AnyDocument,
        update_profile_1.UpdatePasswordDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Patch)('/update'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UsePipes)(new validation_pipe_1.ValidationPipe()),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_dto_1.UpdateUserDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)('/admin/update'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Document_1.AnyDocument, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Get)('/admin/accounts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Document_1.AnyDocument, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllAccounts", null);
__decorate([
    (0, common_1.Post)('/info'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UsePipes)(new validation_pipe_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_user_information_1.GetUserInformationDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserInformation", null);
__decorate([
    (0, common_1.Get)('/id/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
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
    (0, jwt_auth_guard_1.Public)(),
    __param(0, (0, common_1.Param)('walletAddress')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getByWalletAddress", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "delete", null);
UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map