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
exports.StakingService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_dynamoose_1 = require("nestjs-dynamoose");
const staking_interface_1 = require("./staking.interface");
const moment = require("moment");
let StakingService = class StakingService {
    constructor(stakingModel) {
        this.stakingModel = stakingModel;
    }
    async create(staking) {
        return this.stakingModel.create(staking);
    }
    formatEventData(initData, currentTime, subtractType, formatType, formatCompare, tempDate) {
        const formattedData = [];
        for (let i = 0; i <= (subtractType === 'hours' ? 23 : currentTime); i++) {
            const data = {
                time: tempDate ? moment(tempDate)
                    .subtract(currentTime - i, subtractType)
                    .format(formatType) : moment()
                    .subtract(currentTime - i, subtractType)
                    .format(formatType),
                total: initData
                    .filter((data) => +moment(data.stakedTime)
                    .format(formatCompare) === +(subtractType === 'hours' ? i : tempDate ? moment(tempDate)
                    .subtract(currentTime - i, subtractType)
                    .format(formatCompare) : moment()
                    .subtract(currentTime - i, subtractType)
                    .format(formatCompare)))
                    .map((staking) => {
                    staking.amount = staking.type === staking_interface_1.EStakingType.staking ? staking.amount : -staking.amount;
                    return staking.amount;
                })
                    .reduce((previousValue, currentValue) => previousValue + currentValue, 0),
            };
            formattedData.push(data);
        }
        return formattedData;
    }
    formatDataAnalysisResponse(dailyData, weeklyData, monthlyData, allTimeData, totalAvailableTickets) {
        let dailyRange = [
            {
                min: 0,
                max: 4,
                total: 0,
                time: '00:00AM'
            },
            {
                min: 4,
                max: 8,
                total: 0,
                time: '04:00AM'
            },
            {
                min: 8,
                max: 12,
                total: 0,
                time: '08:00AM'
            },
            {
                min: 12,
                max: 16,
                total: 0,
                time: '12:00PM'
            },
            {
                min: 16,
                max: 20,
                total: 0,
                time: '04:00PM'
            },
            {
                min: 20,
                max: 24,
                total: 0,
                time: '08:00PM'
            },
            {
                min: 24,
                max: 28,
                total: 0,
                time: '12:00AM'
            }
        ];
        dailyData.forEach(data => {
            dailyRange = dailyRange.map(item => {
                if (+data.time.substr(0, 2) >= item.min && +data.time.substr(0, 2) < item.max) {
                    item.total += data.total;
                }
                return item;
            });
        });
        dailyRange = dailyRange.map(item => {
            delete item.min;
            delete item.max;
            return item;
        });
        return {
            daily: {
                data: dailyRange,
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
    async getDataByTime(startTime, endTime) {
        return this.stakingModel.scan('stakedTime').ge(startTime).and().where('stakedTime').le(endTime).exec();
    }
};
StakingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_dynamoose_1.InjectModel)('Stakings')),
    __metadata("design:paramtypes", [Object])
], StakingService);
exports.StakingService = StakingService;
//# sourceMappingURL=staking.service.js.map