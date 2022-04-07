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
const uuid_1 = require("uuid");
const jwt_auth_guard_1 = require("../../guard/jwt-auth.guard");
const validation_pipe_1 = require("../../pipes/validation.pipe");
const createSupport_dto_1 = require("./DTO/createSupport.dto");
const support_service_1 = require("./support.service");
const support_interface_1 = require("./support.interface");
const mail_service_1 = require("../mail/mail.service");
let SupportController = class SupportController {
    constructor(supportService, mailService) {
        this.supportService = supportService;
        this.mailService = mailService;
    }
    async createEvent(request, body) {
        let support = new support_interface_1.Support();
        Object.assign(support, body);
        support.ticket_uuid = (0, uuid_1.v4)();
        support.status = support_interface_1.Status.open;
        support = await this.supportService.create(support);
        const content = `
      Dear sir,<br>
      Thank for your support ticket request. <br><br>
      We will response in 2, 3 days in working days via your email. <br>
      Your support request information as bellow: <br>
      Ticket Id: <b>${support.ticket_uuid}</b><br>
      Subject: <b>${support.subject}</b><br>
      Description: <b>${support.description}</b><br>
      Category: <b>${support.category}</b><br>
      Blockchain: <b>${support.blockchain}</b><br>
      Transaction hash: <b>${support.transaction_hash}</b><br>
      Wallet: <b>${support.wallet}</b><br>
      <br><br>
      Best regards,<br>
      Support team
    `;
        const subject = `[Support submitted] ${support.subject}`;
        this.mailService.sendEmail(support.email, subject, content);
        return {
            code: 201,
            message: 'support_created',
            data: support,
        };
    }
};
__decorate([
    (0, common_1.Post)('/'),
    (0, jwt_auth_guard_1.Public)(),
    (0, common_1.UsePipes)(new validation_pipe_1.ValidationPipe()),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, createSupport_dto_1.CreateSupportDTO]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "createEvent", null);
SupportController = __decorate([
    (0, common_1.Controller)('supports'),
    __metadata("design:paramtypes", [support_service_1.SupportService,
        mail_service_1.MailService])
], SupportController);
exports.SupportController = SupportController;
//# sourceMappingURL=support.controller.js.map