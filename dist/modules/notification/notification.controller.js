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
exports.NotificationController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../guard/jwt-auth.guard");
const events_service_1 = require("./events.service");
const notification_service_1 = require("./notification.service");
let NotificationController = class NotificationController {
    constructor(notiService, eventService) {
        this.notiService = notiService;
        this.eventService = eventService;
    }
    async subscribeTopic(req) {
        try {
            const payloadStr = req.body;
            const payload = JSON.parse(payloadStr);
            if (req.header('x-amz-sns-message-type') === 'SubscriptionConfirmation') {
                const url = payload.SubscribeURL;
                const response = await this.notiService.callGetApi(url);
                await response.forEach((value) => {
                    if (value.status === 200) {
                        console.log('subscribed');
                        return 'Yes! We have accepted the confirmation from AWS';
                    }
                    else {
                        throw new common_1.HttpException('Unable to subscribe to given URL', 400);
                    }
                });
            }
            else if (req.header('x-amz-sns-message-type') === 'Notification') {
                this.eventService.emit('noti.created', payload);
            }
            else {
                throw new common_1.HttpException(`Invalid message type ${payload.Type}`, 400);
            }
        }
        catch (error) {
            console.error(error);
            throw new common_1.InternalServerErrorException(error);
        }
    }
    sse() {
        return this.eventService.subscribe('noti.created');
    }
};
__decorate([
    (0, jwt_auth_guard_1.Public)(),
    (0, common_1.Post)('/noti'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "subscribeTopic", null);
__decorate([
    (0, jwt_auth_guard_1.Public)(),
    (0, common_1.Sse)('/noti/sse'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "sse", null);
NotificationController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [notification_service_1.NotificationService,
        events_service_1.EventsService])
], NotificationController);
exports.NotificationController = NotificationController;
//# sourceMappingURL=notification.controller.js.map