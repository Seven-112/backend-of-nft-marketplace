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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const aws_amplify_1 = require("aws-amplify");
const auth_service_1 = require("./auth.service");
const register_dto_1 = require("./DTO/register.dto");
const user_service_1 = require("../modules/user/user.service");
const user_interface_1 = require("../modules/user/user.interface");
const jwt_auth_guard_1 = require("../guard/jwt-auth.guard");
const login_dto_1 = require("./DTO/login.dto");
const validation_pipe_1 = require("../pipes/validation.pipe");
const wallet_service_1 = require("../modules/wallet/wallet.service");
const walletVerify_dto_1 = require("./DTO/walletVerify.dto");
const forgotPassword_dto_1 = require("./DTO/forgotPassword.dto");
const mail_service_1 = require("../modules/mail/mail.service");
const resetPassword_dto_1 = require("./DTO/resetPassword.dto");
const loginGoogle_dto_1 = require("./DTO/loginGoogle.dto");
let AuthController = class AuthController {
    constructor(authService, userService, walletService, mailService) {
        this.authService = authService;
        this.userService = userService;
        this.walletService = walletService;
        this.mailService = mailService;
    }
    async register(body) {
        try {
            await aws_amplify_1.Auth.signUp(body.email, body.password);
            return {
                code: common_1.HttpStatus.CREATED,
                message: 'User created',
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async login(body) {
        try {
            const response = await aws_amplify_1.Auth.signIn(body.email, body.password);
            return {
                code: common_1.HttpStatus.OK,
                accessToken: response.signInUserSession.accessToken.jwtToken,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async loginGoogle(body) {
        var _a, _b;
        try {
            const info = await this.authService.getTokenInfo(body.token);
            const user = await this.userService.getUserByEmail(info.email);
            if (user) {
                return;
            }
            const newUser = new user_interface_1.User({
                email: info.email,
                firstName: body.firstName,
                lastName: body.lastName,
                type: user_interface_1.UserType.google,
                social: {
                    googleId: body.googleId,
                },
            });
            const registeredUser = await this.userService.create(newUser);
            return;
        }
        catch (error) {
            if (((_b = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) === 'invalid_token') {
                throw new common_1.ForbiddenException('Invalid token');
            }
            throw error;
        }
    }
    async isAuthenticated(req) {
        try {
            Reflect.deleteProperty(req.user, 'password');
            return req.user;
        }
        catch (error) {
            throw error;
        }
    }
    async forgotPassword(body) {
        try {
            const user = await this.userService.getUserByEmail(body.email);
            if (!user) {
                throw new common_1.NotFoundException('User not found!');
            }
            return this.mailService.sendForgotPasswordEmail(user);
        }
        catch (error) {
            throw error;
        }
    }
    async resetPassword(body) {
        try {
            const user = await this.userService.getUserByEmail(body.email);
            if (!user) {
                throw new common_1.NotFoundException('User not found!');
            }
            const password = await this.userService.hashPassword(body.password);
            const updated = await this.userService.updatePassword(user.id, password);
            return updated;
        }
        catch (error) {
            throw error;
        }
    }
    async walletRequest() {
        return this.walletService.generateKey();
    }
    async walletVerify(body) {
        var _a;
        try {
            const isValid = await this.walletService.verifyKey(body.key, body.iv, body.publicKey, body.sign);
            if (!isValid) {
                throw new common_1.BadRequestException();
            }
            const wallet = await this.walletService.findByWalletAddress(body.publicKey);
            if (!wallet.count) {
                throw new common_1.NotFoundException();
            }
            const userId = (_a = wallet === null || wallet === void 0 ? void 0 : wallet[0]) === null || _a === void 0 ? void 0 : _a.userId;
            const user = await this.userService.findById(userId);
            return;
        }
        catch (error) {
            if (error.code === 'ERR_CRYPTO_INVALID_IV') {
                throw new common_1.BadRequestException('Invalid IV');
            }
            throw error;
        }
    }
};
__decorate([
    (0, common_1.Post)('/register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, jwt_auth_guard_1.Public)(),
    (0, common_1.UsePipes)(new validation_pipe_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('/login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, jwt_auth_guard_1.Public)(),
    (0, common_1.UsePipes)(new validation_pipe_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('/login/google'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, jwt_auth_guard_1.Public)(),
    (0, common_1.UsePipes)(new validation_pipe_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [loginGoogle_dto_1.LoginGoogleDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginGoogle", null);
__decorate([
    (0, common_1.Get)('/isAuthenticated'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "isAuthenticated", null);
__decorate([
    (0, common_1.Post)('/forgot-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, jwt_auth_guard_1.Public)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgotPassword_dto_1.ForgotPasswordDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('/reset-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, jwt_auth_guard_1.Public)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [resetPassword_dto_1.ResetPasswordDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Get)('/wallet/request'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, jwt_auth_guard_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "walletRequest", null);
__decorate([
    (0, common_1.Post)('/wallet/verify'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, jwt_auth_guard_1.Public)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [walletVerify_dto_1.WalletVerifyDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "walletVerify", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_service_1.UserService,
        wallet_service_1.WalletService,
        mail_service_1.MailService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map