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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const googleapis_1 = require("googleapis");
const user_service_1 = require("../modules/user/user.service");
const aws = require("aws-sdk");
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.oAuthClient = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
    }
    async validateUser(username, password) {
        return true;
    }
    async getTokenInfo(token) {
        return this.oAuthClient.getTokenInfo(token);
    }
    hashEmailAndOtp(email, otp) {
        return this.jwtService.sign({ email, otp }, { expiresIn: '5m' });
    }
    verifyOtp(otp) {
        return this.jwtService.verify(otp);
    }
    async updatePassword(email, password) {
        const cognitoIdentityServiceProvider = new aws.CognitoIdentityServiceProvider();
        return await new Promise((res, rej) => {
            cognitoIdentityServiceProvider.adminSetUserPassword({
                Password: password,
                Permanent: true,
                Username: email,
                UserPoolId: process.env.AWS_USER_POOL
            }, (data, error) => {
                if (error) {
                    console.log({ error });
                    rej(error);
                }
                ;
                console.log({ data });
                res(data);
            });
        });
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map