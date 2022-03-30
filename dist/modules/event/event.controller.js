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
exports.EventController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../guard/jwt-auth.guard");
const validation_pipe_1 = require("../../pipes/validation.pipe");
const create_event_dto_1 = require("./DTO/create-event.dto");
const event_interface_1 = require("./event.interface");
const event_service_1 = require("./event.service");
let EventController = class EventController {
    constructor(eventService) {
        this.eventService = eventService;
    }
    async createEvent(request, body) {
        const ticket = new event_interface_1.Ticket();
        Object.assign(ticket, body.ticket);
        ticket.saleStart = new Date(body.ticket.saleStart);
        ticket.saleEnd = new Date(body.ticket.saleEnd);
        const event = new event_interface_1.Event();
        Object.assign(event, body);
        event.userId = request.user.sub;
        event.startDate = new Date(body.startDate);
        event.endDate = new Date(body.endDate);
        event.publishDate = new Date(body.publishDate);
        event.ticket = Object.assign({}, ticket);
        const newEvent = await this.eventService.createEvent(event);
        return {
            code: 201,
            message: 'Event created',
            data: newEvent,
        };
    }
    async getEvents(limit) {
        const events = await this.eventService.getAllEvents(limit);
        return {
            code: 200,
            message: '',
            data: { events, length: events.length },
        };
    }
    async getEventById(id) {
        const event = await this.eventService.getEventById(id);
        return {
            code: 200,
            message: '',
            data: event,
        };
    }
};
__decorate([
    (0, common_1.Post)('/create'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UsePipes)(new validation_pipe_1.ValidationPipe()),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_event_dto_1.CreateEventDTO]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "createEvent", null);
__decorate([
    (0, common_1.Get)('/'),
    (0, jwt_auth_guard_1.Public)(),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "getEvents", null);
__decorate([
    (0, common_1.Get)('/:id'),
    (0, jwt_auth_guard_1.Public)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "getEventById", null);
EventController = __decorate([
    (0, common_1.Controller)('event'),
    __metadata("design:paramtypes", [event_service_1.EventService])
], EventController);
exports.EventController = EventController;
//# sourceMappingURL=event.controller.js.map