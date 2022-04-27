import { UserTicket } from './userTicket.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Event, EventKey } from './event.interface';
import * as moment from 'moment';
import { SortOrder } from 'dynamoose/dist/General';
@Injectable()
export class EventService {
  constructor(
    @InjectModel('Event')
    private readonly eventModel: Model<Event, EventKey>,
    @InjectModel('UserTicket')
    private readonly userTicketModel: Model<UserTicket, UserTicket['id']>
  ) {}

  async createEvent(event: Event) {
    return this.eventModel.create(event);
  }

  async getEventById(id: string) {
    const event = await this.eventModel.scan('id').eq(id).exec();
    return event.length ? (await event['populate']())[0] : null;
  }

  async getAllEvents(limit?: number) {
    try {
      if (limit) return this.eventModel.query('table').eq('event').limit(limit).sort(SortOrder.descending).exec();

      return this.eventModel.query('table').eq('event').sort(SortOrder.descending).exec();
    } catch(e) {
      return [];
    }
    
  }

  async updateEvent(eventKey: EventKey, body: any) {
    delete body.table;
    delete body.timestamp;
    return this.eventModel.update(eventKey, body);
  }

  async createUserTicket(userTicket: UserTicket) {
    return this.userTicketModel.create(userTicket);
  }

  async getUserTicketByTime(firstTime: number, lastTime: number) {
    return this.userTicketModel.scan('createdAt').ge(firstTime).and().where('createdAt').le(lastTime).exec()
  }

  async getUserTicketByTimeAndEvent(firstTime: number, lastTime: number, id: string) {
    return this.userTicketModel.scan('createdAt').ge(firstTime)
      .and()
      .where('createdAt').le(lastTime)
      .and()
      .where('event').eq(id)
      .exec()
  }

  async getEventAvailable( currentTime: number) {
    return this.eventModel.scan('ticket.saleEnd').ge(currentTime).exec();
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
            (userTicket) => +moment(userTicket.createdAt)
              .format(formatCompare) === +(subtractType === 'hours' ? i :  tempDate ? moment(tempDate)
              .subtract(currentTime - i, subtractType)
              .format(formatCompare) : moment()
              .subtract(currentTime - i, subtractType)
              .format(formatCompare))
          )
          .map((userTicket) => userTicket.number_ticket)
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

  async getUserTicketByEventId(id: string) {
    return this.userTicketModel.scan('event').eq(id).exec();
  }

  async getUserTicketByEventIds(ids: string[]) {
    return this.userTicketModel.scan('event').in(ids).exec();
  }
  
  async getDataByTime(startTime: number, endTime: number) {
    return this.eventModel.scan('createdAt').ge(startTime).and().where('createdAt').le(endTime).exec()
  }
}
