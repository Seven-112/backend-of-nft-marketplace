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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_dynamoose_1 = require("nestjs-dynamoose");
let ChatService = class ChatService {
    constructor(chatModel) {
        this.chatModel = chatModel;
    }
    async createChatChannel(chat) {
        return this.chatModel.create(chat);
    }
    async getChatByUserId(id) {
        return this.chatModel.get(id);
    }
    async updateChat(data) {
        return this.chatModel.update(data);
    }
};
ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_dynamoose_1.InjectModel)('Chat')),
    __metadata("design:paramtypes", [Object])
], ChatService);
exports.ChatService = ChatService;
//# sourceMappingURL=chat.service.js.map