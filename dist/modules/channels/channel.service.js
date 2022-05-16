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
exports.ChannelService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_dynamoose_1 = require("nestjs-dynamoose");
const caching_1 = require("../../utils/caching");
const redis_service_1 = require("../redis/redis.service");
let ChannelService = class ChannelService {
    constructor(channelModel, redisService) {
        this.channelModel = channelModel;
        this.redisService = redisService;
    }
    clear() {
        this.redisService.delWithPrefix(caching_1.Caching.CHANNELS_BY_USER, caching_1.Caching.CHANNEL_BY_NAMES);
    }
    async create(support) {
        this.clear();
        return this.channelModel.create(support);
    }
    async get(userId) {
        const cached = await this.redisService.getWithPrefix(caching_1.Caching.CHANNELS_BY_USER, userId);
        if (cached) {
            return JSON.parse(cached);
        }
        const channels = await this.channelModel
            .scan('from')
            .eq(userId)
            .or()
            .where('to')
            .eq(userId)
            .exec();
        const populated = await channels['populate']();
        if (channels.length) {
            this.redisService.setWithPrefix(caching_1.Caching.CHANNELS_BY_USER, userId, JSON.stringify(populated));
        }
        return populated;
    }
    async getChannelByName(names) {
        const cached = await this.redisService.getWithPrefix(caching_1.Caching.CHANNELS_BY_USER, names.join(','));
        if (cached) {
            return JSON.parse(cached);
        }
        let query = this.channelModel.scan('name').eq(names[0]);
        names.forEach((name) => {
            if (name !== names[0]) {
                query = query.or().where('name').eq(name);
            }
        });
        const channel = await query.exec();
        const jsoned = await channel['toJSON']();
        if (channel.length) {
            this.redisService.setWithPrefix(caching_1.Caching.CHANNEL_BY_NAMES, names.join(','), JSON.stringify(jsoned));
        }
        return jsoned;
    }
    async update(data) {
        this.clear();
        return this.channelModel.update(data);
    }
};
ChannelService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_dynamoose_1.InjectModel)('Channels')),
    __metadata("design:paramtypes", [Object, redis_service_1.RedisService])
], ChannelService);
exports.ChannelService = ChannelService;
//# sourceMappingURL=channel.service.js.map