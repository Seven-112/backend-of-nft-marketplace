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
const update_watchlist_dto_1 = require("./DTO/update-watchlist.dto");
const watchlist_interface_1 = require("./watchlist.interface");
const watchlist_service_1 = require("./watchlist.service");
let WatchlistController = class WatchlistController {
    constructor(watchlistService) {
        this.watchlistService = watchlistService;
    }
    async update(request, body) {
        const watchlist = new watchlist_interface_1.Watchlist();
        watchlist.id = request.user.sub;
        watchlist.list = body.list;
        const updated = await this.watchlistService.update(watchlist);
        updated.list = Array.from(updated.list);
        return {
            code: 200,
            message: 'Updated watchlist',
            data: updated,
        };
    }
    async get(request) {
        const watchlist = await this.watchlistService.get(request.user.sub);
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
    (0, common_1.Patch)('/update'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_watchlist_dto_1.UpdateWatchlistDTO]),
    __metadata("design:returntype", Promise)
], WatchlistController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WatchlistController.prototype, "get", null);
WatchlistController = __decorate([
    (0, common_1.Controller)('watchlist'),
    __metadata("design:paramtypes", [watchlist_service_1.WatchlistService])
], WatchlistController);
exports.WatchlistController = WatchlistController;
//# sourceMappingURL=watchlist.controller.js.map