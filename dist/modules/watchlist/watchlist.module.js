"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatchlistModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_dynamoose_1 = require("nestjs-dynamoose");
const user_module_1 = require("../user/user.module");
const watchlist_controller_1 = require("./watchlist.controller");
const watchlist_schema_1 = require("./watchlist.schema");
const watchlist_service_1 = require("./watchlist.service");
let WatchlistModule = class WatchlistModule {
};
WatchlistModule = __decorate([
    (0, common_1.Module)({
        imports: [
            user_module_1.UserModule,
            nestjs_dynamoose_1.DynamooseModule.forFeature([
                {
                    name: 'Watchlist',
                    schema: watchlist_schema_1.WatchlistSchema,
                },
            ]),
        ],
        exports: [watchlist_service_1.WatchlistService],
        providers: [watchlist_service_1.WatchlistService],
        controllers: [watchlist_controller_1.WatchlistController],
    })
], WatchlistModule);
exports.WatchlistModule = WatchlistModule;
//# sourceMappingURL=watchlist.module.js.map