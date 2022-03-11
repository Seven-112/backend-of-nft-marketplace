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
const client_sns_1 = require("@aws-sdk/client-sns");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../guard/jwt-auth.guard");
const validation_pipe_1 = require("../../pipes/validation.pipe");
const notifyGroup_dto_1 = require("./DTO/notifyGroup.dto");
const events_service_1 = require("./events.service");
const notification_service_1 = require("./notification.service");
const nanoid_1 = require("nanoid");
const markRead_dto_1 = require("./DTO/markRead.dto");
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
                const { userId, msg, type, sender } = JSON.parse(payload.Message);
                userId.forEach((id) => {
                    const idx = (0, nanoid_1.nanoid)();
                    const noti = {
                        messageId: idx,
                        message: msg,
                        type,
                        timeStamp: payload.Timestamp,
                        receiver: id,
                        sender,
                        isRead: false,
                    };
                    this.notiService.createNotification(noti).then(() => {
                        this.eventService.emit(`noti.created${id}`, Object.assign({ code: 200 }, noti));
                    });
                });
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
    sse(id) {
        console.log(id);
        return this.eventService.subscribe(`noti.created${id}`);
    }
    async getNotiByReceiver(req, type, limit = 5) {
        console.log(type);
        const decryptedUserInfo = req.user;
        const allNoti = [];
        const formattedType = JSON.parse(type);
        if (formattedType.length > 0) {
            for (let i = 0; i < formattedType.length; i++) {
                const notiPerType = await this.notiService.getNotificationByReceiver(decryptedUserInfo.sub, formattedType[i]);
                allNoti.push(...notiPerType);
            }
        }
        return {
            code: 200,
            message: '',
            data: {
                notifications: allNoti,
            },
        };
    }
    async sendNotiToUsers(body) {
        try {
            const publishText = await this.notiService.snsClient.send(new client_sns_1.PublishCommand({
                TopicArn: process.env.AWS_SNS_TOPIC_ARN,
                Message: JSON.stringify(Object.assign({}, body)),
            }));
            return {
                code: 200,
                msg: 'Successfully publish message',
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async markRead(body) {
        return this.notiService.markRead(body.messageIds);
    }
};
__decorate([
    (0, jwt_auth_guard_1.Public)(),
    (0, common_1.Post)('/'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "subscribeTopic", null);
__decorate([
    (0, jwt_auth_guard_1.Public)(),
    (0, common_1.Sse)('/sse/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "sse", null);
__decorate([
    (0, common_1.Get)('/:type'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('type')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getNotiByReceiver", null);
__decorate([
    (0, common_1.Post)('/user'),
    (0, common_1.UsePipes)(new validation_pipe_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notifyGroup_dto_1.NotifyGroupDTO]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "sendNotiToUsers", null);
__decorate([
    (0, common_1.Post)('/mark-read'),
    (0, common_1.UsePipes)(new validation_pipe_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [markRead_dto_1.MarkReadDTO]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markRead", null);
NotificationController = __decorate([
    (0, common_1.Controller)('noti'),
    __metadata("design:paramtypes", [notification_service_1.NotificationService,
        events_service_1.EventsService])
], NotificationController);
exports.NotificationController = NotificationController;
//# sourceMappingURL=notification.controller.js.map