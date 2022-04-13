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
exports.SubscriptionService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_dynamoose_1 = require("nestjs-dynamoose");
let SubscriptionService = class SubscriptionService {
    constructor(subscriptionModel) {
        this.subscriptionModel = subscriptionModel;
    }
    async create(subscription) {
        return this.subscriptionModel.create(subscription);
    }
    async get(limit, lastKey) {
        if (lastKey) {
            return this.subscriptionModel.scan().startAt(lastKey).limit(limit).exec();
        }
        return this.subscriptionModel.scan().limit(limit).exec();
    }
    async getSubscriptionDetail(id) {
        return this.subscriptionModel.get(id);
    }
    async delete(id) {
        return this.subscriptionModel.delete(id);
    }
    async getSubscriptionByEmail(email) {
        return this.subscriptionModel.scan('email').eq(email).exec();
    }
};
SubscriptionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_dynamoose_1.InjectModel)('Subscription')),
    __metadata("design:paramtypes", [Object])
], SubscriptionService);
exports.SubscriptionService = SubscriptionService;
//# sourceMappingURL=subscription.service.js.map