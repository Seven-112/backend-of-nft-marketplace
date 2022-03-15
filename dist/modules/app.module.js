"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const middlewares_1 = require("../middlewares");
const todo_module_1 = require("./todo/todo.module");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("../auth/auth.module");
const user_module_1 = require("./user/user.module");
const app_controller_1 = require("./app.controller");
const core_1 = require("@nestjs/core");
const jwt_auth_guard_1 = require("../guard/jwt-auth.guard");
const nestjs_dynamoose_1 = require("nestjs-dynamoose");
const nft_module_1 = require("./nft/nft.module");
const notification_module_1 = require("./notification/notification.module");
const ioredis_1 = require("@nestjs-modules/ioredis");
const chat_module_1 = require("./chat/chat.module");
const aws_module_1 = require("./aws/aws.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(middlewares_1.LoggerMiddleware).forRoutes('*');
        consumer
            .apply(middlewares_1.TextBodyMiddleware)
            .forRoutes({ path: 'noti', method: common_1.RequestMethod.POST });
    }
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_dynamoose_1.DynamooseModule.forRoot({
                aws: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                    region: process.env.AWS_REGION,
                },
            }),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            todo_module_1.TodoModule,
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            nft_module_1.NFTModule,
            notification_module_1.NotificationModule,
            chat_module_1.ChatModule,
            aws_module_1.AWSModule,
            ioredis_1.RedisModule.forRoot({
                config: {
                    port: +process.env.REDIS_PORT,
                    host: process.env.REDIS_HOST,
                },
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            { provide: core_1.APP_GUARD, useClass: jwt_auth_guard_1.JwtAuthGuard },
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map