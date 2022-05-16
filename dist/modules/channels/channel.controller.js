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
exports.SupportController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../guard/jwt-auth.guard");
const validation_pipe_1 = require("../../pipes/validation.pipe");
const createChannel_dto_1 = require("./DTO/createChannel.dto");
const channel_service_1 = require("./channel.service");
const user_service_1 = require("../user/user.service");
const channel_interface_1 = require("./channel.interface");
let SupportController = class SupportController {
    constructor(channelService, userService) {
        this.channelService = channelService;
        this.userService = userService;
    }
    async createEvent(request, body) {
        const to = await this.userService.getUserById(body.to);
        const from = await this.userService.getUserById(request.user.sub);
        if (!from || !to) {
            return {
                code: 400,
                message: 'user_not_existed',
                data: null,
            };
        }
        const names = [`${from}+${to}`, `${to}+${from}`, body.name];
        let channel = await this.channelService.getChannelByName(names);
        if (channel.length) {
            return {
                code: 200,
                message: 'success',
                data: channel[0],
            };
        }
        const dataChannel = new channel_interface_1.Channel();
        dataChannel.from = from.id;
        dataChannel.to = to.id;
        dataChannel.name = body.name;
        dataChannel.timestamp = new Date().getTime();
        channel = await this.channelService.create(dataChannel);
        return {
            code: 201,
            message: 'channel_created',
            data: channel,
        };
    }
    async getSupports(request) {
        const user = await this.userService.getUserById(request.user.sub);
        if (!user) {
            return {
                code: 400,
                message: 'user_not_found',
                data: null,
            };
        }
        let channels = await this.channelService.get(user.id);
        channels = channels
            .map((channel) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            if (((_a = channel.from) === null || _a === void 0 ? void 0 : _a.id) !== user.id) {
                channel.channelName = ((_b = channel.from) === null || _b === void 0 ? void 0 : _b.username) || ((_c = channel.from) === null || _c === void 0 ? void 0 : _c.email);
                channel.avatar = ((_d = channel.from) === null || _d === void 0 ? void 0 : _d.avatar) || null;
            }
            if (((_e = channel.to) === null || _e === void 0 ? void 0 : _e.id) !== user.id) {
                channel.channelName = ((_f = channel.to) === null || _f === void 0 ? void 0 : _f.username) || ((_g = channel.to) === null || _g === void 0 ? void 0 : _g.email);
                channel.avatar = ((_h = channel.to) === null || _h === void 0 ? void 0 : _h.avatar) || null;
            }
            delete channel.from;
            delete channel.to;
            return channel;
        })
            .sort((a, b) => {
            return b.timestamp - a.timestamp;
        });
        return {
            code: 200,
            message: 'success',
            data: channels,
        };
    }
};
__decorate([
    (0, common_1.Post)('/'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(new validation_pipe_1.ValidationPipe()),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, createChannel_dto_1.CreateChannelDTO]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "createEvent", null);
__decorate([
    (0, common_1.Get)('/'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "getSupports", null);
SupportController = __decorate([
    (0, common_1.Controller)('channels'),
    __metadata("design:paramtypes", [channel_service_1.ChannelService,
        user_service_1.UserService])
], SupportController);
exports.SupportController = SupportController;
//# sourceMappingURL=channel.controller.js.map