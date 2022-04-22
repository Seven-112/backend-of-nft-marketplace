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
exports.EventService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_dynamoose_1 = require("nestjs-dynamoose");
const moment = require("moment");
const General_1 = require("dynamoose/dist/General");
let EventService = class EventService {
    constructor(eventModel, userTicketModel) {
        this.eventModel = eventModel;
        this.userTicketModel = userTicketModel;
    }
    async createEvent(event) {
        return this.eventModel.create(event);
    }
    async getEventById(id) {
        const event = await this.eventModel.scan('id').eq(id).exec();
        return event.length ? event[0] : null;
    }
    async getAllEvents(limit) {
        if (limit)
            return this.eventModel.query('table').eq('support').limit(limit).sort(General_1.SortOrder.descending).exec();
        return this.eventModel.scan().exec();
    }
    async updateEvent(eventKey, body) {
        delete body.table;
        delete body.timestamp;
        return this.eventModel.update(eventKey, body);
    }
    async createUserTicket(userTicket) {
        return this.userTicketModel.create(userTicket);
    }
    async getUserTicketByTime(firstTime, lastTime) {
        return this.userTicketModel.scan('createdAt').ge(firstTime).and().where('createdAt').le(lastTime).exec();
    }
    async getUserTicketByTimeAndEvent(firstTime, lastTime, id) {
        return this.userTicketModel.scan('createdAt').ge(firstTime)
            .and()
            .where('createdAt').le(lastTime)
            .and()
            .where('event').eq(id)
            .exec();
    }
    async getEventAvailable(currentTime) {
        return this.eventModel.scan('ticket.saleEnd').ge(currentTime).exec();
    }
    formatEventData(initData, currentTime, subtractType, formatType, formatCompare) {
        const formattedData = [];
        for (let i = subtractType === 'hours' ? 0 : 1; i <= (subtractType === 'hours' ? 23 : currentTime); i++) {
            const data = {
                time: moment()
                    .subtract(currentTime - i, subtractType)
                    .format(formatType),
                total: initData
                    .filter((userTicket) => +moment(userTicket.createdAt)
                    .format(formatCompare) === +(subtractType === 'hours' ? i : moment()
                    .subtract(currentTime - i, subtractType)
                    .format(formatCompare)))
                    .map((userTicket) => userTicket.number_ticket)
                    .reduce((previousValue, currentValue) => previousValue + currentValue, 0),
            };
            formattedData.push(data);
        }
        return formattedData;
    }
    formatDataAnalysisResponse(dailyData, weeklyData, monthlyData, allTimeData, totalAvailableTickets) {
        return {
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
    }
    async getUserTicketByEventId(id) {
        return this.userTicketModel.scan('event').eq(id).exec();
    }
    async getUserTicketByEventIds(ids) {
        return this.userTicketModel.scan('event').in(ids).exec();
    }
};
EventService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_dynamoose_1.InjectModel)('Event')),
    __param(1, (0, nestjs_dynamoose_1.InjectModel)('UserTicket')),
    __metadata("design:paramtypes", [Object, Object])
], EventService);
exports.EventService = EventService;
//# sourceMappingURL=event.service.js.map