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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_dynamoose_1 = require("nestjs-dynamoose");
const aws = require("aws-sdk");
const transformCognitoUser_1 = require("../../utils/transformCognitoUser");
let UserService = class UserService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async isWalletAvailable(address) {
        const user = await this.userModel.scan('walletAddress').eq(address).exec();
        return !user.count;
    }
    async isUserAvailable(id) {
        const user = await this.userModel.get(id);
        return !user;
    }
    async getUserById(id) {
        return this.userModel.get(id);
    }
    async createUser(data) {
        return this.userModel.create(data);
    }
    async getUserByUsername(username) {
        return this.userModel.scan('username').eq(username).exec();
    }
    async getByWalletAddress(address) {
        return this.userModel.scan('walletAddress').eq(address).exec();
    }
    async updateUser(user) {
        return this.userModel.update(user);
    }
    async updateWalletAddress(id, email, walletAddress) {
        return this.userModel.update(id, { walletAddress, email });
    }
    async getUsers(ids) {
        return this.userModel.batchGet(ids);
    }
    async getUserFromCognito(accessToken) {
        const cognitoIdentityServiceProvider = new aws.CognitoIdentityServiceProvider();
        return new Promise((resolve, reject) => {
            cognitoIdentityServiceProvider.getUser({ AccessToken: accessToken }, function (error, data) {
                if (error) {
                    reject(error);
                }
                if (!data) {
                    throw new common_1.ForbiddenException();
                }
                resolve((0, transformCognitoUser_1.transformCognitoUser)(data));
            });
        });
    }
    async searchUsers(address) {
        return this.userModel.scan('walletAddress').contains(address).exec();
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_dynamoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [Object])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map