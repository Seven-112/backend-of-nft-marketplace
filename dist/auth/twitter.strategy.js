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
exports.TwitterOauthStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const passport_twitter_1 = require("passport-twitter");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const user_service_1 = require("../modules/user/user.service");
let TwitterOauthStrategy = class TwitterOauthStrategy extends (0, passport_1.PassportStrategy)(passport_twitter_1.Strategy, 'twitter') {
    constructor(configService, userService) {
        super({
            consumerKey: 'F3BRj1PKbGnPSMTZAnltTLCkg',
            consumerSecret: 'BYG2DKa9otjVWFtwxUXPjxYILzi9f8IIOAew7neLTof44DQezL',
            callbackURL: '/v1/auth/twitter/callback',
        });
        this.userService = userService;
    }
    async validate(accessToken, refreshToken, profile) {
        return {
            accessToken,
            refreshToken,
            profile,
        };
    }
};
TwitterOauthStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        user_service_1.UserService])
], TwitterOauthStrategy);
exports.TwitterOauthStrategy = TwitterOauthStrategy;
//# sourceMappingURL=twitter.strategy.js.map