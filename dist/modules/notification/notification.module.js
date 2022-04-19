"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const notification_controller_1 = require("./notification.controller");
const notification_service_1 = require("./notification.service");
const events_service_1 = require("./events.service");
const nestjs_dynamoose_1 = require("nestjs-dynamoose");
const notification_schema_1 = require("./notification.schema");
const redis_module_1 = require("../redis/redis.module");
const event_emitter_1 = require("@nestjs/event-emitter");
let NotificationModule = class NotificationModule {
};
NotificationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule,
            nestjs_dynamoose_1.DynamooseModule.forFeature([
                {
                    name: 'Notification',
                    schema: notification_schema_1.NotificationSchema,
                },
            ]),
            redis_module_1.RedisModule,
            event_emitter_1.EventEmitterModule.forRoot(),
        ],
        controllers: [notification_controller_1.NotificationController],
        exports: [notification_service_1.NotificationService],
        providers: [notification_service_1.NotificationService, events_service_1.EventsService],
    })
], NotificationModule);
exports.NotificationModule = NotificationModule;
//# sourceMappingURL=notification.module.js.map