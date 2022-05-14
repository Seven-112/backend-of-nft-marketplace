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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const moment = require("moment");
const jwt_auth_guard_1 = require("../../guard/jwt-auth.guard");
const event_service_1 = require("../event/event.service");
const nft_service_1 = require("../nft/nft.service");
const user_interface_1 = require("../user/user.interface");
const user_service_1 = require("../user/user.service");
let UserController = class UserController {
    constructor(userService, eventService, nftService) {
        this.userService = userService;
        this.eventService = eventService;
        this.nftService = nftService;
    }
    async dashboard(request) {
        const user = await this.userService.getUserById(request.user.sub);
        if (user.deletedAt) {
            return {
                code: 400,
                message: 'user_is_deleted',
            };
        }
        if (user.role !== user_interface_1.UserRole.Admin) {
            return {
                code: 400,
                message: 'user_not_permission',
            };
        }
        const lastWeekStartDate = moment()
            .subtract(1, 'weeks')
            .startOf('isoWeek')
            .valueOf();
        const lastWeekEndDate = moment()
            .subtract(1, 'weeks')
            .endOf('isoWeek')
            .valueOf();
        const currentWeekStartDate = moment().startOf('isoWeek').valueOf();
        const currentWeekEndDate = moment().valueOf();
        let [lastWeekUsers, currentWeekUsers, allUsers, lastWeekNftBought, currentWeekNftBought, allBought, lastWeekEvents, currentWeekEvents, allEvents,] = await Promise.all([
            this.userService.getDataByTime(lastWeekStartDate, lastWeekEndDate),
            this.userService.getDataByTime(currentWeekStartDate, currentWeekEndDate),
            this.userService.getAllUsers(),
            this.nftService.getDataByTime(lastWeekStartDate, lastWeekEndDate),
            this.nftService.getDataByTime(currentWeekStartDate, currentWeekEndDate),
            this.nftService.getAllUserBought(),
            this.eventService.getDataByTime(lastWeekStartDate, lastWeekEndDate),
            this.eventService.getDataByTime(currentWeekStartDate, lastWeekEndDate),
            this.eventService.getAllEvents(),
        ]);
        let userPercent = lastWeekUsers.length
            ? ((currentWeekUsers.length - lastWeekUsers.length) /
                lastWeekUsers.length) *
                100
            : 100;
        if (!currentWeekUsers.length && !lastWeekUsers.length) {
            userPercent = 0;
        }
        let eventPercent = lastWeekEvents.length
            ? ((currentWeekEvents.length - lastWeekEvents.length) /
                lastWeekEvents.length) *
                100
            : 100;
        if (!currentWeekEvents.length && !lastWeekEvents.length) {
            eventPercent = 0;
        }
        lastWeekNftBought = await lastWeekNftBought['populate']();
        currentWeekNftBought = await currentWeekNftBought['populate']();
        allBought = await allBought['populate']();
        const lastWeekTotalPrice = lastWeekNftBought
            .map((nftBought) => { var _a; return +((_a = nftBought.nft) === null || _a === void 0 ? void 0 : _a.price) || 0; })
            .reduce((prev, current) => prev + current, 0);
        const currentWeekTotalPrice = currentWeekNftBought
            .map((nftBought) => { var _a; return +((_a = nftBought.nft) === null || _a === void 0 ? void 0 : _a.price) || 0; })
            .reduce((prev, current) => prev + current, 0);
        const totalPrice = allBought
            .map((nftBought) => { var _a; return +((_a = nftBought.nft) === null || _a === void 0 ? void 0 : _a.price) || 0; })
            .reduce((prev, current) => prev + current, 0);
        let boughtPercent = lastWeekTotalPrice
            ? ((currentWeekTotalPrice - lastWeekTotalPrice) / lastWeekTotalPrice) *
                100
            : 100;
        if (!currentWeekTotalPrice && !lastWeekTotalPrice) {
            boughtPercent = 0;
        }
        const responseData = {
            user: {
                percent: userPercent.toFixed(2),
                total: allUsers.length,
            },
            event: {
                percent: eventPercent.toFixed(2),
                total: allEvents.length,
            },
            nftBought: {
                percent: boughtPercent.toFixed(2),
                total: totalPrice,
            },
        };
        return {
            code: 200,
            message: 'successful',
            data: responseData,
        };
    }
};
__decorate([
    (0, common_1.Get)('/'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "dashboard", null);
UserController = __decorate([
    (0, common_1.Controller)('dashboards'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        event_service_1.EventService,
        nft_service_1.NftService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=dashboard.controller.js.map