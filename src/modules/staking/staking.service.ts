import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { EStakingType, Staking } from './staking.interface';
import * as moment from 'moment';
import { SortOrder } from 'dynamoose/dist/General';
@Injectable()
export class StakingService {
  constructor(
    @InjectModel('Stakings')
    private readonly stakingModel: Model<Staking, Staking['id']>
  ) {}

  async create(staking: Staking) {
    return this.stakingModel.create(staking);
  }

  formatEventData(initData: any[], currentTime: number, subtractType: any, formatType: string, formatCompare: string, tempDate?: moment.Moment) {
    const formattedData = [];
    for (let i = 0; i <= (subtractType === 'hours' ? 23 : currentTime); i++) {
      const data = {
        time: tempDate ? moment(tempDate)
          .subtract(currentTime - i, subtractType)
          .format(formatType) : moment()
          .subtract(currentTime - i, subtractType)
          .format(formatType),
        total: initData
          .filter(
            (data) => +moment(data.stakedTime)
              .format(formatCompare) === +(subtractType === 'hours' ? i :  tempDate ? moment(tempDate)
              .subtract(currentTime - i, subtractType)
              .format(formatCompare) : moment()
              .subtract(currentTime - i, subtractType)
              .format(formatCompare))
          )
          .map((staking) => {
            staking.amount = staking.type === EStakingType.staking ? staking.amount : -staking.amount
            return staking.amount;
          })
          .reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0,
          ),
      };
      formattedData.push(data);
    }
    return formattedData;
  }

  formatDataAnalysisResponse(dailyData: any, weeklyData: any, monthlyData: any, allTimeData: any, totalAvailableTickets: number) {
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
        if(+data.time.substr(0, 2) >= item.min && +data.time.substr(0, 2) < item.max) {
          item.total += data.total
        }
        return item;
      })
    })

    dailyRange = dailyRange.map(item => {
      delete item.min;
      delete item.max;
      return item;
    })
    return {
      daily: {
        data: dailyRange,
        availableTickets: totalAvailableTickets,
        soldTickets: dailyData
          .map((dt) => dt.total)
          .reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0,
          ),
      },
      weekly: {
        data: weeklyData,
        availableTickets: totalAvailableTickets,
        soldTickets: weeklyData
          .map((dt) => dt.total)
          .reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0,
          ),
      },
      monthly: {
        data: monthlyData,
        availableTickets: totalAvailableTickets,
        soldTickets: monthlyData
          .map((dt) => dt.total)
          .reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0,
          ),
      },
      allTime: {
        data: allTimeData,
        availableTickets: totalAvailableTickets,
        soldTickets: allTimeData
          .map((dt) => dt.total)
          .reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0,
          ),
      },
    };
  }
  
  async getDataByTime(startTime: number, endTime: number) {
    return this.stakingModel.scan('stakedTime').ge(startTime).and().where('stakedTime').le(endTime).exec()
  }
}
