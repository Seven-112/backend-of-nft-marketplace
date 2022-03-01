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
let NotificationService = class NotificationService {
    constructor(httpService, notificationModel) {
        this.httpService = httpService;
        this.notificationModel = notificationModel;
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
    async getAllNotification() {
        return this.notificationModel.scan().exec();
    }
    async getNotificationById(id) {
        return this.notificationModel.get(id);
    }
};
NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, nestjs_dynamoose_1.InjectModel)('Notification')),
    __metadata("design:paramtypes", [axios_1.HttpService, Object])
], NotificationService);
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map