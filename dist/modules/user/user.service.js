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
const redis_service_1 = require("../redis/redis.service");
const caching_1 = require("../../utils/caching");
const getFirstTruthy_1 = require("../../utils/getFirstTruthy");
let UserService = class UserService {
    constructor(userModel, redisService) {
        this.userModel = userModel;
        this.redisService = redisService;
    }
    async clear() {
        Promise.all(this.redisService.delWithPrefix(caching_1.Caching.ALL_USER, caching_1.Caching.SEARCH_USER, caching_1.Caching.USER_BY_EMAIL, caching_1.Caching.USER_BY_ID, caching_1.Caching.USER_BY_IDS, caching_1.Caching.USER_BY_USERNAME, caching_1.Caching.USER_BY_WALLET_ADDRESS, caching_1.Caching.USER_BY_TIME));
        return;
    }
    async isWalletAvailable(address) {
        const cached = await this.redisService.getWithPrefix(caching_1.Caching.USER_BY_WALLET_ADDRESS, address);
        if (cached) {
            return false;
        }
        const user = await this.userModel.scan('walletAddress').eq(address).exec();
        if (user.length) {
            this.redisService.setWithPrefix(caching_1.Caching.USER_BY_WALLET_ADDRESS, address, JSON.stringify(user));
        }
        return !user.length;
    }
    async isUserAvailable(id) {
        const cached = await this.redisService.getWithPrefix(caching_1.Caching.USER_BY_ID, id);
        if (cached) {
            return false;
        }
        const user = await this.userModel.get(id);
        if (user) {
            this.redisService.setWithPrefix(caching_1.Caching.USER_BY_ID, id, JSON.stringify(user));
        }
        return !user;
    }
    async getUserById(id) {
        const cached = await this.redisService.getWithPrefix(caching_1.Caching.USER_BY_ID, id);
        if (cached) {
            return JSON.parse(cached);
        }
        const user = await this.userModel.get(id);
        if (user) {
            this.redisService.setWithPrefix(caching_1.Caching.USER_BY_ID, id, JSON.stringify(user));
        }
        return user;
    }
    async getUserByIdOrWallet(id) {
        const cached = await Promise.all([
            this.redisService.getWithPrefix(caching_1.Caching.USER_BY_ID, id),
            this.redisService.getWithPrefix(caching_1.Caching.USER_BY_WALLET_ADDRESS, id),
        ]);
        const value = (0, getFirstTruthy_1.default)(cached);
        if (value) {
            return JSON.parse(value);
        }
        const user = await this.userModel
            .scan('id')
            .eq(id)
            .or()
            .where('walletAddress')
            .eq(id)
            .exec();
        if (user.length) {
            Promise.all([
                this.redisService.setWithPrefix(caching_1.Caching.USER_BY_ID, id, JSON.stringify(user)),
                this.redisService.setWithPrefix(caching_1.Caching.USER_BY_WALLET_ADDRESS, id, JSON.stringify(user)),
            ]);
        }
        return user;
    }
    async getUserByUsername(username) {
        const cached = await this.redisService.getWithPrefix(caching_1.Caching.USER_BY_USERNAME, username);
        if (cached) {
            return JSON.parse(cached);
        }
        const user = await this.userModel.scan('username').eq(username).exec();
        if (user.length) {
            this.redisService.setWithPrefix(caching_1.Caching.USER_BY_USERNAME, username, JSON.stringify(user));
        }
        return user;
    }
    async getByWalletAddress(address) {
        const cached = await this.redisService.getWithPrefix(caching_1.Caching.USER_BY_WALLET_ADDRESS, address);
        if (cached) {
            return JSON.parse(cached);
        }
        const user = await this.userModel.scan('walletAddress').eq(address).exec();
        if (user.length) {
            this.redisService.setWithPrefix(caching_1.Caching.USER_BY_WALLET_ADDRESS, address, JSON.stringify(user));
        }
        return user;
    }
    async getUserByWalletAddressOrId(key) {
        const cached = await Promise.all([
            this.redisService.getWithPrefix(caching_1.Caching.USER_BY_ID, key),
            this.redisService.getWithPrefix(caching_1.Caching.USER_BY_WALLET_ADDRESS, key),
        ]);
        const value = (0, getFirstTruthy_1.default)(cached);
        if (value) {
            return JSON.parse(value);
        }
        const userById = await this.userModel.get(key);
        if (userById) {
            this.redisService.setWithPrefix(caching_1.Caching.USER_BY_ID, key, JSON.stringify(userById));
            return userById;
        }
        const users = await this.userModel.scan('walletAddress').eq(key).exec();
        if (users.length) {
            this.redisService.setWithPrefix(caching_1.Caching.USER_BY_WALLET_ADDRESS, key, JSON.stringify(users[0]));
        }
        return users[0] || null;
    }
    async getByEmail(email) {
        const cached = await this.redisService.getWithPrefix(caching_1.Caching.USER_BY_EMAIL, email);
        if (cached) {
            return JSON.parse(cached);
        }
        const user = await this.userModel.scan('email').eq(email).exec();
        if (user.length) {
            this.redisService.setWithPrefix(caching_1.Caching.USER_BY_EMAIL, email, JSON.stringify(user));
        }
        return user;
    }
    async updateUser(user) {
        this.clear();
        return this.userModel.update(user);
    }
    async updateWalletAddress(id, body) {
        body.id = id;
        this.clear();
        return this.userModel.update(body);
    }
    async getUsers(ids) {
        const cached = await this.redisService.getWithPrefix(caching_1.Caching.USER_BY_IDS, ids.join(','));
        if (cached) {
            return JSON.parse(cached);
        }
        const users = await this.userModel
            .scan('id')
            .in(ids)
            .or()
            .where('walletAddress')
            .in(ids)
            .exec();
        if (users.length) {
            this.redisService.setWithPrefix(caching_1.Caching.USER_BY_IDS, ids.join(','), JSON.stringify(users));
        }
        return users;
    }
    async getAllUsers(limit) {
        if (limit) {
            const cached = await this.redisService.getWithPrefix(caching_1.Caching.ALL_USER, '' + limit);
            if (cached) {
                return JSON.parse(cached);
            }
            const user = await this.userModel
                .scan('deletedAt')
                .not()
                .exists()
                .limit(limit)
                .exec();
            if (user.length) {
                this.redisService.setWithPrefix(caching_1.Caching.ALL_USER, '' + limit, JSON.stringify(user));
            }
            return user;
        }
        const cached = await this.redisService.getWithPrefix(caching_1.Caching.ALL_USER, '');
        if (cached) {
            return JSON.parse(cached);
        }
        const user = await this.userModel.scan('deletedAt').not().exists().exec();
        if (user.length) {
            this.redisService.setWithPrefix(caching_1.Caching.ALL_USER, '', JSON.stringify(user));
        }
        return user;
    }
    async getUserFromCognito(accessToken) {
        const cognitoIdentityServiceProvider = new aws.CognitoIdentityServiceProvider();
        return new Promise((resolve, reject) => {
            cognitoIdentityServiceProvider.getUser({ AccessToken: accessToken }, function (error, data) {
                if (error) {
                    reject(error);
                }
                if (!data) {
                    return resolve({});
                }
                resolve((0, transformCognitoUser_1.transformCognitoUser)(data));
            });
        });
    }
    async changePassword(data) {
        const cognitoIdentityServiceProvider = new aws.CognitoIdentityServiceProvider();
        return new Promise((resolve, reject) => {
            cognitoIdentityServiceProvider.changePassword(data, function (err, response) {
                if (err) {
                    reject(err);
                }
                resolve(response);
            });
        });
    }
    async searchUsers(address) {
        const cached = await this.redisService.getWithPrefix(caching_1.Caching.SEARCH_USER, address);
        if (cached) {
            return JSON.parse(cached);
        }
        const user = await this.userModel
            .scan('walletAddress')
            .contains(address)
            .or()
            .where('username')
            .contains(address)
            .or()
            .where('email')
            .contains(address)
            .exec();
        if (user.length) {
            this.redisService.setWithPrefix(caching_1.Caching.SEARCH_USER, address, JSON.stringify(user));
        }
        return user;
    }
    async getUserByEmail(email) {
        const cached = await this.redisService.getWithPrefix(caching_1.Caching.USER_BY_EMAIL, email);
        if (cached) {
            return JSON.parse(cached);
        }
        const user = await this.userModel.scan('email').eq(email).exec();
        if (user.length) {
            this.redisService.setWithPrefix(caching_1.Caching.USER_BY_EMAIL, email, JSON.stringify(user));
        }
        return user;
    }
    async disableUserCognito(email) {
        const cognitoIdentityServiceProvider = new aws.CognitoIdentityServiceProvider();
        await cognitoIdentityServiceProvider.adminDisableUser({
            Username: email,
            UserPoolId: 'eu-west-2_xi1EqOokH',
        }, (error, response) => {
            console.log(error, response);
        });
    }
    async enableUserCognito(email) {
        const cognitoIdentityServiceProvider = new aws.CognitoIdentityServiceProvider();
        await cognitoIdentityServiceProvider.adminEnableUser({
            Username: email,
            UserPoolId: 'eu-west-2_xi1EqOokH',
        }, (error, response) => {
            console.log(error, response);
        });
    }
    async getDataByTime(startTime, endTime) {
        const cached = await this.redisService.getWithPrefix(caching_1.Caching.USER_BY_TIME, startTime.toString() + ',' + endTime.toString());
        if (cached) {
            return JSON.parse(cached);
        }
        const user = await this.userModel
            .scan('createdAt')
            .ge(startTime)
            .and()
            .where('createdAt')
            .le(endTime)
            .exec();
        if (user.length) {
            this.redisService.setWithPrefix(caching_1.Caching.USER_BY_TIME, startTime.toString() + ',' + endTime.toString(), JSON.stringify(user));
        }
        return user;
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_dynamoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [Object, redis_service_1.RedisService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map