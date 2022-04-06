"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_dynamoose_1 = require("nestjs-dynamoose");
const user_module_1 = require("../user/user.module");
const event_controller_1 = require("./event.controller");
const event_schema_1 = require("./event.schema");
const event_service_1 = require("./event.service");
const userTicket_schema_1 = require("./userTicket.schema");
let EventModule = class EventModule {
};
EventModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_dynamoose_1.DynamooseModule.forFeature([
                {
                    name: 'Event',
                    schema: event_schema_1.EventSchema,
                },
                {
                    name: 'UserTicket',
                    schema: userTicket_schema_1.UserTicketSchema,
                },
            ]),
            user_module_1.UserModule,
        ],
        providers: [event_service_1.EventService],
        exports: [event_service_1.EventService],
        controllers: [event_controller_1.EventController],
    })
], EventModule);
exports.EventModule = EventModule;
//# sourceMappingURL=event.module.js.map