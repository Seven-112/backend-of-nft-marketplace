import { UserTicket } from './userTicket.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Event } from './event.interface';
import * as moment from 'moment';
@Injectable()
export class EventService {
  constructor(
    @InjectModel('Event')
    private readonly eventModel: Model<Event, Event['id']>,
    @InjectModel('UserTicket')
    private readonly userTicketModel: Model<UserTicket, UserTicket['id']>
  ) {}

  async createEvent(event: Event) {
    return this.eventModel.create(event);
  }

  async getEventById(id: string) {
    return this.eventModel.get(id);
  }

  async getAllEvents(limit?: number) {
    if (limit) return this.eventModel.scan().limit(limit).exec();

    return this.eventModel.scan().exec();
  }

  async updateEvent(id: string, body: any) {
    return this.eventModel.update(id, body);
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

  formatEventData(initData: any[], currentTime: number, subtractType: any, formatType: string, formatCompare: string) {
    const formattedData = [];
    for (let i = subtractType === 'hours' ? 0 : 1; i <= (subtractType === 'hours' ? 23 : currentTime); i++) {
      const data = {
        time: moment()
          .subtract(currentTime - i, subtractType)
          .format(formatType),
        total: initData
          .filter(
            (userTicket) => +moment(userTicket.createdAt)
              .format(formatCompare) === +(subtractType === 'hours' ? i :  moment()
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
    return {
      daily: {
        data: dailyData,
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
  
}
