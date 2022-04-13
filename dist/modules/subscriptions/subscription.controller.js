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
exports.SubscriptionController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../guard/jwt-auth.guard");
const validation_pipe_1 = require("../../pipes/validation.pipe");
const subscribe_dto_1 = require("./DTO/subscribe.dto");
const subscription_service_1 = require("./subscription.service");
const subscription_interface_1 = require("./subscription.interface");
const mail_service_1 = require("../mail/mail.service");
let SubscriptionController = class SubscriptionController {
    constructor(subscriptionService, mailService) {
        this.subscriptionService = subscriptionService;
        this.mailService = mailService;
    }
    async subscribe(request, body) {
        console.log(body.email);
        const checkEmailIsExisted = await (await this.subscriptionService.getSubscriptionByEmail(body.email))['toJSON']();
        console.log(checkEmailIsExisted);
        if (checkEmailIsExisted.length) {
            return {
                error: 400,
                message: 'you_already_subscribed'
            };
        }
        let subscription = new subscription_interface_1.Subscription();
        subscription.email = body.email;
        subscription = await this.subscriptionService.create(subscription);
        const content = `
      Dear sir,<br>
      Thanks for your subscribe our system.<br>
      You will receive new letter from us when have new updated on MetaVersus System.<br>
      For unsubscribe. Please click at <a href="http://192.248.168.248/unsubscribe/${subscription.id}">here</a><br>

      <i>This is automatic email. Please don't reply this email.</i>
      Best regards,<br>
      MetaVersus
    `;
        const subject = `Subscribe successfully`;
        this.mailService.sendEmail(subscription.email, subject, content);
        return {
            code: 201,
            message: 'subscribe_successfully',
        };
    }
    async unsubscribe(request, id) {
        const subscription = await this.subscriptionService.getSubscriptionDetail(id);
        if (subscription) {
            await this.subscriptionService.delete(id);
            const content = `
        Dear sir,<br>
        Your unsubscribe MetaVersus system succssfully.<br>
        Best regards,<br>
        MetaVersus
      `;
            const subject = `Unsubscribe successfully`;
            this.mailService.sendEmail(subscription.email, subject, content);
        }
        return {
            code: 200,
            message: 'unsubscribe_successfully',
        };
    }
};
__decorate([
    (0, common_1.Post)('/subscribe'),
    (0, jwt_auth_guard_1.Public)(),
    (0, common_1.UsePipes)(new validation_pipe_1.ValidationPipe()),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, subscribe_dto_1.SubscribeDTO]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "subscribe", null);
__decorate([
    (0, common_1.Post)('/unsubscribe/:id'),
    (0, jwt_auth_guard_1.Public)(),
    (0, common_1.UsePipes)(new validation_pipe_1.ValidationPipe()),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "unsubscribe", null);
SubscriptionController = __decorate([
    (0, common_1.Controller)('subscriptions'),
    __metadata("design:paramtypes", [subscription_service_1.SubscriptionService,
        mail_service_1.MailService])
], SubscriptionController);
exports.SubscriptionController = SubscriptionController;
//# sourceMappingURL=subscription.controller.js.map