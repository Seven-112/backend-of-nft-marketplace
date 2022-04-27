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
exports.SocketGateway = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const websockets_1 = require("@nestjs/websockets");
const AWS = require("aws-sdk");
const socket_io_1 = require("socket.io");
const socket_guard_1 = require("../../guard/socket.guard");
const notifyGroup_dto_1 = require("../notification/DTO/notifyGroup.dto");
const user_service_1 = require("../user/user.service");
let SocketGateway = class SocketGateway {
    constructor(userService) {
        this.userService = userService;
        this.logger = new common_1.Logger();
    }
    async handleMessage(client, payload) {
        try {
            const params = {
                TopicArn: process.env.AWS_SNS_TOPIC_ARN,
                Message: JSON.stringify(Object.assign({}, payload)),
            };
            const sns = await new AWS.SNS().publish(params).promise();
            if (sns.$response.error)
                throw sns.$response.error;
        }
        catch (error) {
            console.log(error);
        }
    }
    handleEmitMessage(payload) {
        this.server
            .to(payload.receiver)
            .emit('notiCreated', JSON.stringify(payload));
    }
    afterInit(server) {
        this.logger.log('Init');
    }
    async handleConnection(client, ...args) {
        if (client.handshake.auth.token) {
            const user = await this.userService.getUserFromCognito(client.handshake.auth.token);
            if (user) {
                this.logger.log('Client connected:', client.id);
                client.join(user.sub);
            }
            else {
                client.disconnect();
            }
        }
        else {
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        this.logger.log('Client disconnected:', client.id);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], SocketGateway.prototype, "server", void 0);
__decorate([
    (0, common_1.UseGuards)(socket_guard_1.SocketAuthGuard),
    (0, websockets_1.SubscribeMessage)('sendNoti'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, notifyGroup_dto_1.NotifyGroupDTO]),
    __metadata("design:returntype", Promise)
], SocketGateway.prototype, "handleMessage", null);
__decorate([
    (0, event_emitter_1.OnEvent)('noti.created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SocketGateway.prototype, "handleEmitMessage", null);
SocketGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: 'socket',
        cors: { origin: '*' },
        transports: ['websocket'],
        reconnect: true,
    }),
    __metadata("design:paramtypes", [user_service_1.UserService])
], SocketGateway);
exports.SocketGateway = SocketGateway;
//# sourceMappingURL=socket.gateway.js.map