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
exports.WatchlistController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../guard/jwt-auth.guard");
const user_service_1 = require("../user/user.service");
const update_watchlist_dto_1 = require("./DTO/update-watchlist.dto");
const watchlist_service_1 = require("./watchlist.service");
let WatchlistController = class WatchlistController {
    constructor(watchlistService, userService) {
        this.watchlistService = watchlistService;
        this.userService = userService;
    }
    async add(request, body) {
        const currentWatchlist = (await this.watchlistService.get(request.user.sub)) || {
            id: request.user.sub,
            list: [],
        };
        const user = await this.userService.getUserById(request.user.sub);
        if (user.walletAddress === body.address) {
            return {
                code: 200,
                message: "Can't not add your self to watchlist",
                data: null,
            };
        }
        currentWatchlist.list = Array.from(new Set(currentWatchlist.list).add(body.address));
        const updated = await this.watchlistService.update(currentWatchlist);
        updated.list = Array.from(updated.list);
        return {
            code: 200,
            message: 'Updated watchlist',
            data: updated,
        };
    }
    async remove(request, body) {
        const currentWatchlist = (await this.watchlistService.get(request.user.sub)) || {
            id: request.user.sub,
            list: [],
        };
        const newList = new Set(currentWatchlist.list);
        body.addresses.forEach((address) => newList.delete(address));
        currentWatchlist.list = Array.from(newList.size ? newList : []);
        const updated = await this.watchlistService.update(currentWatchlist);
        updated.list = Array.from(updated.list);
        return {
            code: 200,
            message: 'Updated watchlist',
            data: updated,
        };
    }
    async get(request, relations) {
        const watchlist = (await this.watchlistService.get(request.user.sub)) || {
            id: request.user.sub,
            list: [],
            users: [],
        };
        if (relations === null || relations === void 0 ? void 0 : relations.includes('users')) {
            const promises = (watchlist === null || watchlist === void 0 ? void 0 : watchlist.list.map((item) => this.userService.getByWalletAddress(item))) || [];
            watchlist.users = (await Promise.all(promises)).map((item) => item[0]);
        }
        watchlist.list = Array.from(watchlist.list);
        return {
            code: 200,
            message: '',
            data: watchlist || {
                id: request.user.sub,
                list: [],
            },
        };
    }
};
__decorate([
    (0, common_1.Patch)('/add'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_watchlist_dto_1.AddWatchlistDTO]),
    __metadata("design:returntype", Promise)
], WatchlistController.prototype, "add", null);
__decorate([
    (0, common_1.Patch)('/remove'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_watchlist_dto_1.RemoveWatchlistDTO]),
    __metadata("design:returntype", Promise)
], WatchlistController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiQuery)({
        name: 'relations',
        required: false,
        explode: false,
        type: String,
        isArray: true,
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('relations')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], WatchlistController.prototype, "get", null);
WatchlistController = __decorate([
    (0, common_1.Controller)('watchlist'),
    __metadata("design:paramtypes", [watchlist_service_1.WatchlistService,
        user_service_1.UserService])
], WatchlistController);
exports.WatchlistController = WatchlistController;
//# sourceMappingURL=watchlist.controller.js.map