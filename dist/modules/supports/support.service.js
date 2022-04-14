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
exports.SupportService = void 0;
const common_1 = require("@nestjs/common");
const General_1 = require("dynamoose/dist/General");
const nestjs_dynamoose_1 = require("nestjs-dynamoose");
let SupportService = class SupportService {
    constructor(supportModel) {
        this.supportModel = supportModel;
    }
    async create(support) {
        return this.supportModel.create(support);
    }
    async get(limit, lastKey) {
        if (lastKey) {
            return this.supportModel.query('table').eq('support').startAt(lastKey).limit(limit).sort(General_1.SortOrder.descending).exec();
        }
        return this.supportModel.query('table').eq('support').limit(limit).sort(General_1.SortOrder.descending).exec();
    }
    async getSupportByTicket(ticket) {
        const supports = await (await this.supportModel.scan('ticket_uuid').eq(ticket).exec())['toJSON']();
        return supports[0] || null;
    }
    async updateSupport(table, data) {
        console.log(data);
        delete data.createdAt;
        delete data.updatedAt;
        data.timestamp = new Date().getTime();
        this.supportModel.delete(table);
        this.supportModel.create(data);
    }
};
SupportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_dynamoose_1.InjectModel)('Supports')),
    __metadata("design:paramtypes", [Object])
], SupportService);
exports.SupportService = SupportService;
//# sourceMappingURL=support.service.js.map