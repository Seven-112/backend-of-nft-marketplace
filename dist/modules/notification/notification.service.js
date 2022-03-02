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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const client_sns_1 = require("@aws-sdk/client-sns");
const axios_1 = require("@nestjs/axios");
const nestjs_dynamoose_1 = require("nestjs-dynamoose");
const redis_service_1 = require("../redis/redis.service");
const redis_interface_1 = require("../redis/redis.interface");
let NotificationService = class NotificationService {
    constructor(httpService, notificationModel, redisService) {
        this.httpService = httpService;
        this.notificationModel = notificationModel;
        this.redisService = redisService;
        this.snsClient = new client_sns_1.SNSClient({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
    }
    async callGetApi(url) {
        return this.httpService.get(url);
    }
    async createNotification(notification) {
        return this.notificationModel.create(notification);
    }
    async deleteAllNotification() {
        const items = await this.notificationModel.scan().exec();
        const ids = items.map((item) => item.messageId);
        return this.notificationModel.batchDelete(ids);
    }
    async getAllNotification() {
        return this.notificationModel.scan().exec();
    }
    async getNotificationById(id) {
        return this.notificationModel.get(id);
    }
    async getAllNotificationRedis(userId) {
        const list = await this.redisService.getAll(redis_interface_1.EListType.notification);
        return list.filter((item) => item.userId === userId);
    }
};
NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, nestjs_dynamoose_1.InjectModel)('Notification')),
    __metadata("design:paramtypes", [axios_1.HttpService, Object, redis_service_1.RedisService])
], NotificationService);
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map