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
const user_interface_1 = require("../user/user.interface");
const user_service_1 = require("../user/user.service");
const create_event_dto_1 = require("./DTO/create-event.dto");
const buyTicket_dto_1 = require("./DTO/buyTicket.dto");
const event_interface_1 = require("./event.interface");
const event_service_1 = require("./event.service");
const userTicket_interface_1 = require("./userTicket.interface");
const moment = require("moment");
let EventController = class EventController {
    constructor(eventService, userService) {
        this.eventService = eventService;
        this.userService = userService;
    }
    async createEvent(request, body) {
        const ticket = new event_interface_1.Ticket();
        Object.assign(ticket, body.ticket);
        ticket.saleStart = new Date(body.ticket.saleStart);
        ticket.saleEnd = new Date(body.ticket.saleEnd);
        ticket.remain = body.ticket.quantity;
        const event = new event_interface_1.Event();
        Object.assign(event, body);
        event.user = request.user.sub;
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
    async updateEvent(request, body) {
        const user = await this.userService.getUserById(request.user.sub);
        const foundEvent = await this.eventService.getEventById(body.id);
        if (!user)
            return {
                code: 404,
                message: 'User not found',
                data: null,
            };
        if (user.role !== user_interface_1.UserRole.Admin)
            return {
                code: 403,
                message: 'Not allowed',
                data: null,
            };
        if (!foundEvent)
            return {
                code: 404,
                message: 'Event not found',
            };
        const { id } = body;
        delete body.id;
        const updateBody = Object.assign(Object.assign({}, body), { publishDate: new Date(body.publishDate), startDate: new Date(body.startDate), endDate: new Date(body.endDate), createdAt: new Date(body.createdAt), ticket: Object.assign(Object.assign({}, body.ticket), { saleStart: new Date(body.ticket.saleStart), saleEnd: new Date(body.ticket.saleEnd) }) });
        const updatedEvent = await this.eventService.updateEvent(id, updateBody);
        return {
            code: 201,
            message: 'Event updated',
            data: updatedEvent,
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
    async getEventAnalisys(request) {
        const dailyData = [];
        const weeklyData = [];
        const monthlyData = [];
        const allTimeData = [];
        const currentTime = moment().valueOf();
        let availableTicketSellEvents = await (await this.eventService.getEventAvailable(currentTime))['toJSON']();
        const totalAvailableTickets = availableTicketSellEvents
            .map((evt) => evt.ticket.remain)
            .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
        const firstDailyTime = moment(moment().format('YYYY-MM-DD 00:00')).valueOf();
        let userTicketDaily = await (await this.eventService.getUserTicketByTime(firstDailyTime, currentTime))['populate']();
        userTicketDaily = await userTicketDaily['toJSON']();
        const currentHour = moment(currentTime).format('HH');
        for (let i = 0; i <= 23; i++) {
            const data = {
                time: moment()
                    .subtract(+currentHour - i, 'hours')
                    .format('HH:00'),
                total: userTicketDaily
                    .filter((userTicket) => +moment(userTicket.createdAt).format('HH') === i)
                    .map((userTicket) => userTicket.number_ticket)
                    .reduce((previousValue, currentValue) => previousValue + currentValue, 0),
            };
            dailyData.push(data);
        }
        const firstWeeklyTime = moment().startOf('isoWeek').valueOf();
        let userTicketWeekly = await (await this.eventService.getUserTicketByTime(firstWeeklyTime, currentTime))['populate']();
        userTicketWeekly = await userTicketWeekly['toJSON']();
        const currentDate = moment(currentTime).isoWeekday();
        for (let i = 1; i <= +currentDate; i++) {
            const data = {
                time: moment()
                    .subtract(currentDate - i, 'days')
                    .format('YYYY-MM-DD'),
                total: userTicketWeekly
                    .filter((userTicket) => moment(userTicket.createdAt).format('DD') ===
                    moment()
                        .subtract(currentDate - i, 'days')
                        .format('DD'))
                    .map((userTicket) => userTicket.number_ticket)
                    .reduce((previousValue, currentValue) => previousValue + currentValue, 0),
            };
            weeklyData.push(data);
        }
        const firstMonthlyTime = moment(moment().format('YYYY-MM-01 00:00:00')).valueOf();
        let duration = +moment(currentTime).format('DD');
        let userTicketMonthly = await (await this.eventService.getUserTicketByTime(firstMonthlyTime, currentTime))['populate']();
        userTicketMonthly = await userTicketMonthly['toJSON']();
        for (let i = 1; i <= +duration; i++) {
            const data = {
                time: moment()
                    .subtract(duration - i, 'days')
                    .format('YYYY-MM-DD'),
                total: userTicketMonthly
                    .filter((userTicket) => moment(userTicket.createdAt).format('DD') ===
                    moment()
                        .subtract(duration - i, 'days')
                        .format('DD'))
                    .map((userTicket) => userTicket.number_ticket)
                    .reduce((previousValue, currentValue) => previousValue + currentValue, 0),
            };
            monthlyData.push(data);
        }
        const firstYearTime = moment(moment().format('YYYY-01-01 00:00:00')).valueOf();
        duration = +moment(currentTime).format('MM');
        let userTicketYearly = await (await this.eventService.getUserTicketByTime(firstYearTime, currentTime))['populate']();
        userTicketYearly = await userTicketYearly['toJSON']();
        for (let i = 1; i <= +duration; i++) {
            const data = {
                time: moment()
                    .subtract(duration - i, 'months')
                    .format('YYYY-MM'),
                total: userTicketYearly
                    .filter((userTicket) => moment(userTicket.createdAt).format('MM') ===
                    moment()
                        .subtract(duration - i, 'months')
                        .format('MM'))
                    .map((userTicket) => userTicket.number_ticket)
                    .reduce((previousValue, currentValue) => previousValue + currentValue, 0),
            };
            allTimeData.push(data);
        }
        const responseData = {
            daily: {
                data: dailyData,
                availableTickets: totalAvailableTickets,
                soldTickets: dailyData
                    .map((dt) => dt.total)
                    .reduce((previousValue, currentValue) => previousValue + currentValue, 0),
            },
            weekly: {
                data: weeklyData,
                availableTickets: totalAvailableTickets,
                soldTickets: weeklyData
                    .map((dt) => dt.total)
                    .reduce((previousValue, currentValue) => previousValue + currentValue, 0),
            },
            monthly: {
                data: monthlyData,
                availableTickets: totalAvailableTickets,
                soldTickets: monthlyData
                    .map((dt) => dt.total)
                    .reduce((previousValue, currentValue) => previousValue + currentValue, 0),
            },
            allTime: {
                data: allTimeData,
                availableTickets: totalAvailableTickets,
                soldTickets: allTimeData
                    .map((dt) => dt.total)
                    .reduce((previousValue, currentValue) => previousValue + currentValue, 0),
            },
        };
        return {
            code: 200,
            message: '',
            data: responseData,
        };
    }
    async getEventById(id, relations) {
        let event = await this.eventService.getEventById(id);
        event = await event.populate({ properties: relations });
        return {
            code: 200,
            message: '',
            data: event,
        };
    }
    async buyEventTicket(id, request, body) {
        const user = await this.userService.getUserById(request.user.sub);
        let event = await this.eventService.getEventById(id);
        if (!user)
            return {
                code: 404,
                message: 'User not found',
                data: null,
            };
        if (!body.number_ticket) {
            return {
                code: 400,
                message: 'number_ticket_is_required',
                data: null,
            };
        }
        if (body.number_ticket > event.ticket.remain) {
            return {
                code: 400,
                message: 'number_ticket_great_than_ticket_remain',
                data: null,
            };
        }
        const userTicketData = new userTicket_interface_1.UserTicket();
        userTicketData.event = event;
        userTicketData.user = user;
        userTicketData.number_ticket = body.number_ticket;
        await this.eventService.createUserTicket(userTicketData);
        event.ticket.remain -= +body.number_ticket;
        delete event.id;
        delete event.updatedAt;
        event = await this.eventService.updateEvent(id, event);
        return {
            code: 200,
            message: 'buy_ticket_successful',
            data: event,
        };
    }
};
__decorate([
    (0, common_1.Post)('/create'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(new validation_pipe_1.ValidationPipe()),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_event_dto_1.CreateEventDTO]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "createEvent", null);
__decorate([
    (0, common_1.Patch)('/update'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_event_dto_1.UpdateEventDTO]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "updateEvent", null);
__decorate([
    (0, common_1.Get)('/'),
    (0, jwt_auth_guard_1.Public)(),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "getEvents", null);
__decorate([
    (0, common_1.Get)('/analysis'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, jwt_auth_guard_1.Public)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "getEventAnalisys", null);
__decorate([
    (0, common_1.Get)('/:id'),
    (0, swagger_1.ApiQuery)({
        name: 'relations',
        required: false,
        explode: false,
        type: String,
        isArray: true,
    }),
    (0, jwt_auth_guard_1.Public)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('relations')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "getEventById", null);
__decorate([
    (0, common_1.Post)('/:id/buy-ticket'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, buyTicket_dto_1.BuyTicketDTO]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "buyEventTicket", null);
EventController = __decorate([
    (0, common_1.Controller)('event'),
    __metadata("design:paramtypes", [event_service_1.EventService,
        user_service_1.UserService])
], EventController);
exports.EventController = EventController;
//# sourceMappingURL=event.controller.js.map