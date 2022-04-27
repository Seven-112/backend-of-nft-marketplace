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
exports.StakingController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../guard/jwt-auth.guard");
const validation_pipe_1 = require("../../pipes/validation.pipe");
const create_staking_dto_1 = require("./DTO/create-staking.dto");
const staking_interface_1 = require("./staking.interface");
const staking_service_1 = require("./staking.service");
const moment = require("moment");
let StakingController = class StakingController {
    constructor(stakingService) {
        this.stakingService = stakingService;
    }
    async createEvent(request, body) {
        let staking = new staking_interface_1.Staking();
        Object.assign(staking, body);
        staking.stakedTime = new Date().getTime();
        staking = await this.stakingService.create(staking);
        return {
            code: 201,
            message: 'created',
            data: staking,
        };
    }
    async getEventAnalisys(request) {
        const currentTime = moment().valueOf();
        const firstDailyTime = moment(moment().format('YYYY-MM-DD 00:00')).valueOf();
        const firstWeeklyTime = moment().startOf('week').valueOf();
        const firstMonthlyTime = moment(moment().format('YYYY-01-01 00:00:00')).valueOf();
        const firstYearTime = moment(moment().format('1970-01-01 00:00:00')).valueOf();
        let results = await Promise.all([
            this.stakingService.getDataByTime(firstDailyTime, currentTime),
            this.stakingService.getDataByTime(firstWeeklyTime, currentTime),
            this.stakingService.getDataByTime(firstMonthlyTime, currentTime),
            this.stakingService.getDataByTime(firstYearTime, currentTime)
        ]);
        let [userTicketDaily, userTicketWeekly, userTicketMonthly, userTicketYearly] = await Promise.all(results.map(result => result['toJSON']()));
        const currentHour = moment(currentTime).format('HH');
        const dailyData = this.stakingService.formatEventData(userTicketDaily, +currentHour, 'hours', 'HH:00', 'HH');
        const endOfWeek = moment().endOf('week').weekday();
        let currentDate = moment().endOf('week');
        const weeklyData = this.stakingService.formatEventData(userTicketWeekly, endOfWeek, 'days', 'YYYY-MM-DD', 'DD', currentDate);
        let duration = 11;
        currentDate = moment().endOf('year');
        const monthlyData = this.stakingService.formatEventData(userTicketMonthly, duration, 'months', 'MMM', 'MM', currentDate);
        const currentYear = moment(currentTime);
        const firstItem = userTicketYearly.sort((a, b) => a.timestamp - b.timestamp)
            .find(item => +moment(item.createdAt).format('YYYY') <= +currentYear.format('YYYY'));
        if (!firstItem) {
            duration = 1;
        }
        else {
            const firstYear = firstItem.createdAt;
            duration = moment.duration(currentYear.diff(firstYear)).asYears();
        }
        const allTimeData = this.stakingService.formatEventData(userTicketYearly, duration, 'years', 'YYYY', 'YYYYY');
        const responseData = this.stakingService.formatDataAnalysisResponse(dailyData, weeklyData, monthlyData, allTimeData, 0);
        return {
            code: 200,
            message: '',
            data: responseData,
        };
    }
};
__decorate([
    (0, common_1.Post)('/'),
    (0, jwt_auth_guard_1.Public)(),
    (0, common_1.UsePipes)(new validation_pipe_1.ValidationPipe()),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_staking_dto_1.CreateStakingDTO]),
    __metadata("design:returntype", Promise)
], StakingController.prototype, "createEvent", null);
__decorate([
    (0, common_1.Get)('/analysis'),
    (0, jwt_auth_guard_1.Public)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StakingController.prototype, "getEventAnalisys", null);
StakingController = __decorate([
    (0, common_1.Controller)('stakings'),
    __metadata("design:paramtypes", [staking_service_1.StakingService])
], StakingController);
exports.StakingController = StakingController;
//# sourceMappingURL=staking.controller.js.map