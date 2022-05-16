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
exports.SupportService = void 0;
const common_1 = require("@nestjs/common");
const General_1 = require("dynamoose/dist/General");
const nestjs_dynamoose_1 = require("nestjs-dynamoose");
const support_interface_1 = require("./support.interface");
const redis_service_1 = require("../redis/redis.service");
const caching_1 = require("../../utils/caching");
let SupportService = class SupportService {
    constructor(supportModel, redisService) {
        this.supportModel = supportModel;
        this.redisService = redisService;
    }
    clear() {
        this.redisService.delWithPrefix(caching_1.Caching.ALL_SUPPORT, caching_1.Caching.SUPPORT_BY_TICKET);
    }
    async create(support) {
        this.clear();
        return this.supportModel.create(support);
    }
    async get(limit, lastKey, status) {
        if (status !== support_interface_1.Status.done &&
            status !== support_interface_1.Status.open &&
            status !== support_interface_1.Status.supporting) {
            if (lastKey) {
                const cached = await this.redisService.getWithPrefix(caching_1.Caching.ALL_SUPPORT, lastKey.id + limit + ',' + status);
                if (cached) {
                    return JSON.parse(cached);
                }
                const supports = await this.supportModel
                    .query('table')
                    .eq('support')
                    .startAt(lastKey)
                    .limit(limit)
                    .sort(General_1.SortOrder.descending)
                    .exec();
                const jsoned = await supports['toJSON']();
                if (supports.length) {
                    this.redisService.setWithPrefix(caching_1.Caching.ALL_SUPPORT, lastKey.id + limit + ',' + status, JSON.stringify(jsoned));
                }
                return jsoned;
            }
            const cached = await this.redisService.getWithPrefix(caching_1.Caching.ALL_SUPPORT, '' + limit + ',' + status);
            if (cached) {
                return JSON.parse(cached);
            }
            const supports = await this.supportModel
                .query('table')
                .eq('support')
                .limit(limit)
                .sort(General_1.SortOrder.descending)
                .exec();
            const jsoned = await supports['toJSON']();
            if (supports.length) {
                this.redisService.setWithPrefix(caching_1.Caching.ALL_SUPPORT, '' + limit + ',' + status, JSON.stringify(jsoned));
            }
            return jsoned;
        }
        if (lastKey) {
            const cached = await this.redisService.getWithPrefix(caching_1.Caching.ALL_SUPPORT, lastKey.id + status);
            if (cached) {
                return JSON.parse(cached);
            }
            const supports = await this.supportModel
                .query('table')
                .eq('support')
                .and()
                .where('status')
                .eq(status)
                .startAt(lastKey)
                .limit(limit)
                .sort(General_1.SortOrder.descending)
                .exec();
            const jsoned = await supports['toJSON']();
            if (supports.length) {
                this.redisService.setWithPrefix(caching_1.Caching.ALL_SUPPORT, lastKey.id + status, JSON.stringify(jsoned));
            }
            return jsoned;
        }
        const cached = await this.redisService.getWithPrefix(caching_1.Caching.ALL_SUPPORT, limit + ',' + status);
        if (cached) {
            return JSON.parse(cached);
        }
        const supports = await this.supportModel
            .query('table')
            .eq('support')
            .and()
            .where('timestamp')
            .ge(0)
            .and()
            .where('status')
            .eq(status)
            .limit(limit)
            .sort(General_1.SortOrder.descending)
            .exec();
        const jsoned = await supports['toJSON']();
        if (supports.length) {
            this.redisService.setWithPrefix(caching_1.Caching.ALL_SUPPORT, limit + ',' + status, JSON.stringify(jsoned));
        }
        return jsoned;
    }
    async getSupportByTicket(ticket) {
        const cached = await this.redisService.getWithPrefix(caching_1.Caching.SUPPORT_BY_TICKET, ticket);
        if (cached) {
            return JSON.parse(cached);
        }
        const supports = await this.supportModel
            .scan('ticket_uuid')
            .eq(ticket)
            .exec();
        const jsoned = await supports['toJSON']();
        if (supports.length) {
            this.redisService.setWithPrefix(caching_1.Caching.SUPPORT_BY_TICKET, ticket, JSON.stringify(jsoned[0]));
        }
        return jsoned[0] || null;
    }
    async updateSupport(table, data) {
        data.timestamp = new Date().getTime();
        this.clear();
        this.supportModel.delete(table);
        this.supportModel.create(data);
    }
    async updateNotDelete(table, data) {
        this.clear();
        return this.supportModel.update(table, data);
    }
};
SupportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_dynamoose_1.InjectModel)('Supports')),
    __metadata("design:paramtypes", [Object, redis_service_1.RedisService])
], SupportService);
exports.SupportService = SupportService;
//# sourceMappingURL=support.service.js.map