"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_dynamoose_1 = require("nestjs-dynamoose");
const redis_module_1 = require("../redis/redis.module");
const user_module_1 = require("../user/user.module");
const channel_controller_1 = require("./channel.controller");
const channel_schema_1 = require("./channel.schema");
const channel_service_1 = require("./channel.service");
let ChannelModule = class ChannelModule {
};
ChannelModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_dynamoose_1.DynamooseModule.forFeature([
                {
                    name: 'Channels',
                    schema: channel_schema_1.ChannelSchema,
                },
            ]),
            user_module_1.UserModule,
            redis_module_1.RedisModule,
        ],
        providers: [channel_service_1.ChannelService],
        exports: [channel_service_1.ChannelService],
        controllers: [channel_controller_1.SupportController],
    })
], ChannelModule);
exports.ChannelModule = ChannelModule;
//# sourceMappingURL=channel.module.js.map