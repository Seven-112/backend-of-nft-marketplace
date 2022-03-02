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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../guard/jwt-auth.guard");
const chat_service_1 = require("./chat.service");
const create_chat_DTO_1 = require("./DTO/create-chat.DTO");
let ChatController = class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    async create(body) {
        const data = await this.chatService.getChatByUserId(body.userId);
        if (!data) {
            return this.chatService.createChatChannel({
                userId: body.userId,
                channels: [body.channel],
            });
        }
        return this.chatService.updateChat({
            userId: body.userId,
            channels: [...new Set([...data.channels, body.channel])],
        });
    }
    async getId(id) {
        return this.chatService.getChatByUserId(id);
    }
};
__decorate([
    (0, common_1.Post)('/create'),
    (0, jwt_auth_guard_1.Public)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_chat_DTO_1.CreateChatDTO]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "create", null);
__decorate([
    (0, jwt_auth_guard_1.Public)(),
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getId", null);
ChatController = __decorate([
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
exports.ChatController = ChatController;
//# sourceMappingURL=chat.controller.js.map