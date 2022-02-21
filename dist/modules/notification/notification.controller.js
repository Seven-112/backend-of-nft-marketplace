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
exports.NotificationController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../guard/jwt-auth.guard");
const client_sns_1 = require("@aws-sdk/client-sns");
let NotificationController = class NotificationController {
    constructor() { }
    async createMessage() {
        try {
            const snsClient = new client_sns_1.SNSClient({
                region: process.env.AWS_REGION,
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                },
            });
            const params = {
                Message: 'Hello',
                TopicArn: 'arn:aws:sns:eu-west-2:565352093069:Test',
            };
            const data = await snsClient.send(new client_sns_1.PublishCommand(params));
            return data;
        }
        catch (error) {
            console.log(error.stack);
        }
    }
};
__decorate([
    (0, jwt_auth_guard_1.Public)(),
    (0, common_1.Get)('/noti'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "createMessage", null);
NotificationController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [])
], NotificationController);
exports.NotificationController = NotificationController;
//# sourceMappingURL=notification.controller.js.map