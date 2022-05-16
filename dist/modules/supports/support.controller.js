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
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../guard/jwt-auth.guard");
const validation_pipe_1 = require("../../pipes/validation.pipe");
const createSupport_dto_1 = require("./DTO/createSupport.dto");
const support_service_1 = require("./support.service");
const support_interface_1 = require("./support.interface");
const mail_service_1 = require("../mail/mail.service");
const replySupport_dto_1 = require("./DTO/replySupport.dto");
const user_service_1 = require("../user/user.service");
const user_interface_1 = require("../user/user.interface");
let SupportController = class SupportController {
    constructor(supportService, mailService, userService) {
        this.supportService = supportService;
        this.mailService = mailService;
        this.userService = userService;
    }
    async createEvent(request, body) {
        let support = new support_interface_1.Support();
        Object.assign(support, body);
        support.ticket_uuid = (0, uuid_1.v4)();
        support.status = support_interface_1.Status.open;
        support.timestamp = new Date().getTime();
        support.createdAt = new Date().getTime();
        support.updatedAt = new Date().getTime();
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
      You can see your support request at <a href="${process.env.APP_URI}/support/${support.ticket_uuid}">here</a>
      <br><br>
      Best regards,<br>
      Support team
    `;
        const subject = `[Support submitted] ${support.ticket_uuid} - ${support.subject}`;
        this.mailService.sendEmail(support.email, subject, content);
        return {
            code: 201,
            message: 'support_created',
            data: support,
        };
    }
    async getSupports(limit, lastItem, status) {
        let supports = await this.supportService.get(limit, lastItem ? { id: lastItem } : null, status);
        const userIds = [];
        supports.forEach((support) => {
            if (support.replies) {
                support.replies.forEach((reply) => {
                    if (reply.user) {
                        userIds.push(reply.user);
                    }
                });
            }
        });
        const users = await this.userService.getUsers(userIds);
        supports = supports.map((support) => {
            if (support.replies) {
                support.replies = support.replies.map((reply) => {
                    if (reply.user) {
                        const user = users.find((user) => user.id === reply.user);
                        reply.username = (user === null || user === void 0 ? void 0 : user.username) || reply.username;
                        reply.email = (user === null || user === void 0 ? void 0 : user.email) || reply.eamil;
                        reply.avatar = (user === null || user === void 0 ? void 0 : user.avatar) || '';
                    }
                    return reply;
                });
            }
            return support;
        });
        return {
            code: 200,
            message: 'success',
            data: supports,
        };
    }
    async adminReply(request, ticket, body) {
        const user = await this.userService.getUserById(request.user.sub);
        if (!user || user.role !== user_interface_1.UserRole.Admin) {
            return {
                code: 400,
                message: 'user_not_permission',
                data: null,
            };
        }
        const support = await this.supportService.getSupportByTicket(ticket);
        if (!support) {
            return {
                code: 400,
                message: 'support_request_not_exited',
                data: null,
            };
        }
        const replies = support.replies || [];
        let reply = new support_interface_1.Reply();
        Object.assign(reply, body);
        reply.user = user.id;
        reply.timestamp = new Date().getTime();
        reply = JSON.parse(JSON.stringify(reply));
        replies.push(reply);
        support.replies = replies;
        await this.supportService.updateSupport({ table: support.table, timestamp: support.timestamp }, support);
        const subject = `[Reply] ${support.ticket_uuid} - ${support.subject}`;
        const content = `
      Dear sir,<br>
      Your support request information as bellow: <br>
      Ticket Id: <b>${support.ticket_uuid}</b><br>
      Subject: <b>${support.subject}</b><br>
      Description: <b>${support.description}</b><br>
      Category: <b>${support.category}</b><br>
      Blockchain: <b>${support.blockchain}</b><br>
      Transaction hash: <b>${support.transaction_hash}</b><br>
      Wallet: <b>${support.wallet}</b><br>
      You can see your support request at <a href="${process.env.APP_URI}/support/${support.ticket_uuid}">here</a><br>
      ----------------------<br>
      ----------------------<br>
      [Reply]
      <p style="white-space: break-all;">
        ${reply.content}
      </p>
      <br><br>
      Best regards,<br>
      Support team<br>
      ${user.username}
    `;
        await this.mailService.sendEmail(support.email, subject, content);
        return {
            code: 200,
            message: 'success',
            data: null,
        };
    }
    async resolveSupport(request, ticket) {
        const user = await this.userService.getUserById(request.user.sub);
        if (!user || user.role !== user_interface_1.UserRole.Admin) {
            return {
                code: 400,
                message: 'user_not_permission',
                data: null,
            };
        }
        const support = await this.supportService.getSupportByTicket(ticket);
        if (!support) {
            return {
                code: 400,
                message: 'support_request_not_exited',
                data: null,
            };
        }
        const dataUpdate = {
            status: support_interface_1.Status.done,
        };
        await this.supportService.updateNotDelete({ table: support.table, timestamp: support.timestamp }, dataUpdate);
        const subject = `[Closed] ${support.ticket_uuid} - ${support.subject}`;
        const content = `
      Dear sir,<br>
      <h2>Your support request is completed.</h2> <br>
      Your support request information as bellow: <br>
      Ticket Id: <b>${support.ticket_uuid}</b><br>
      Subject: <b>${support.subject}</b><br>
      Description: <b>${support.description}</b><br>
      Category: <b>${support.category}</b><br>
      Blockchain: <b>${support.blockchain}</b><br>
      Transaction hash: <b>${support.transaction_hash}</b><br>
      Wallet: <b>${support.wallet}</b><br>
      You can see your support request at <a href="${process.env.APP_URI}/support/${support.ticket_uuid}">here</a><br>
      <br><br>
      Best regards,<br>
      Support team<br>
      ${user.username}
    `;
        await this.mailService.sendEmail(support.email, subject, content);
        return {
            code: 200,
            message: 'success',
            data: null,
        };
    }
    async readSupport(request, ticket) {
        const user = await this.userService.getUserById(request.user.sub);
        if (!user || user.role !== user_interface_1.UserRole.Admin) {
            return {
                code: 400,
                message: 'user_not_permission',
                data: null,
            };
        }
        const support = await this.supportService.getSupportByTicket(ticket);
        if (!support) {
            return {
                code: 400,
                message: 'support_request_not_exited',
                data: null,
            };
        }
        const dataUpdate = {
            isRead: true,
        };
        await this.supportService.updateNotDelete({ table: support.table, timestamp: support.timestamp }, dataUpdate);
        return {
            code: 200,
            message: 'success',
            data: null,
        };
    }
    async userReply(request, ticket, body) {
        const support = await this.supportService.getSupportByTicket(ticket);
        if (!support) {
            return {
                code: 400,
                message: 'support_request_not_exited',
                data: null,
            };
        }
        const replies = support.replies || [];
        let reply = new support_interface_1.Reply();
        Object.assign(reply, body);
        reply.email = support.email;
        reply.timestamp = new Date().getTime();
        reply = JSON.parse(JSON.stringify(reply));
        replies.push(reply);
        support.replies = replies;
        await this.supportService.updateSupport({ table: support.table, timestamp: support.timestamp }, support);
        return {
            code: 200,
            message: 'success',
            data: null,
        };
    }
    async getSupportRequestByTicket(ticket) {
        let support = await this.supportService.getSupportByTicket(ticket);
        const userIds = [];
        if (!support) {
            return {
                code: 400,
                message: 'support_request_not_exited',
                data: null,
            };
        }
        if (support.replies) {
            support.replies.forEach((reply) => {
                if (reply.user) {
                    userIds.push(reply.user);
                }
            });
            let users = [];
            try {
                users = await this.userService.getUsers(userIds);
            }
            catch (e) {
                users = [];
            }
            support.replies = support.replies.map((reply) => {
                if (reply.user) {
                    const user = users.find((user) => user.id === reply.user);
                    reply.username = (user === null || user === void 0 ? void 0 : user.username) || reply.username;
                    reply.email = (user === null || user === void 0 ? void 0 : user.email) || reply.email;
                    reply.avatar = (user === null || user === void 0 ? void 0 : user.avatar) || '';
                }
                else {
                }
                return reply;
            });
        }
        return {
            code: 200,
            message: 'success',
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
__decorate([
    (0, common_1.Get)('/'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('lastItem')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "getSupports", null);
__decorate([
    (0, common_1.Post)('/:ticket/admin/reply'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('ticket')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, replySupport_dto_1.ReplySupportDTO]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "adminReply", null);
__decorate([
    (0, common_1.Post)('/:ticket/resolve'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('ticket')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "resolveSupport", null);
__decorate([
    (0, common_1.Post)('/:ticket/read'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('ticket')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "readSupport", null);
__decorate([
    (0, common_1.Post)('/:ticket/user/reply'),
    (0, jwt_auth_guard_1.Public)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('ticket')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, replySupport_dto_1.ReplySupportDTO]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "userReply", null);
__decorate([
    (0, common_1.Get)('/:ticket'),
    (0, jwt_auth_guard_1.Public)(),
    __param(0, (0, common_1.Param)('ticket')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "getSupportRequestByTicket", null);
SupportController = __decorate([
    (0, common_1.Controller)('supports'),
    __metadata("design:paramtypes", [support_service_1.SupportService,
        mail_service_1.MailService,
        user_service_1.UserService])
], SupportController);
exports.SupportController = SupportController;
//# sourceMappingURL=support.controller.js.map