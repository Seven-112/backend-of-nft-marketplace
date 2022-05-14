import { UserTicket } from './userTicket.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Event, EventKey } from './event.interface';
import * as moment from 'moment';
import { SortOrder } from 'dynamoose/dist/General';
import { RedisService } from '../redis/redis.service';
import { Caching } from 'src/utils/caching';
@Injectable()
export class EventService {
  constructor(
    @InjectModel('Event')
    private readonly eventModel: Model<Event, EventKey>,
    @InjectModel('UserTicket')
    private readonly userTicketModel: Model<UserTicket, UserTicket['id']>,
    private readonly redisService: RedisService,
  ) {}

  clear() {
    this.redisService.delWithPrefix(
      Caching.EVENT_BY_IDS,
      Caching.EVENT_BY_ID,
      Caching.EVENT_TICKET_BY_ID,
      Caching.EVENT_TICKET_BY_IDS,
    );
  }

  async createEvent(event: Event) {
    this.clear();
    return this.eventModel.create(event);
  }

  async getEventById(id: string) {
    const cached = await this.redisService.getWithPrefix(
      Caching.EVENT_BY_ID,
      id,
    );

    if (cached) {
      return JSON.parse(cached);
    }

    const event = await this.eventModel.scan('id').eq(id).exec();

    const populated = (await event['populate']())[0];

    if (event.length) {
      this.redisService.setWithPrefix(
        Caching.EVENT_BY_ID,
        id,
        JSON.stringify(populated),
      );
    }

    return populated;
  }

  async getAllEvents(limit?: number, populate = false) {
    try {
      if (limit) {
        const cached = await this.redisService.getWithPrefix(
          Caching.ALL_EVENT,
          '' + limit,
        );

        if (cached) {
          return JSON.parse(cached);
        }

        let events = await this.eventModel
          .query('table')
          .eq('event')
          .limit(limit)
          .sort(SortOrder.descending)
          .exec();

        if (populate) {
          events = events['populate']();
        }

        if (events.length) {
          this.redisService.setWithPrefix(
            Caching.ALL_EVENT,
            '' + limit,
            JSON.stringify(events),
          );
        }

        return events;
      }

      let events = await this.eventModel
        .query('table')
        .eq('event')
        .sort(SortOrder.descending)
        .exec();

      if (populate) {
        events = events['populate']();
      }

      if (events.length) {
        this.redisService.setWithPrefix(
          Caching.ALL_EVENT,
          '' + limit,
          JSON.stringify(events),
        );
      }

      return events;
    } catch (e) {
      return [];
    }
  }

  async updateEvent(eventKey: EventKey, body: any) {
    delete body.table;
    delete body.timestamp;
    this.clear();
    return this.eventModel.update(eventKey, body);
  }

  async createUserTicket(userTicket: UserTicket) {
    this.clear();
    return this.userTicketModel.create(userTicket);
  }

  async getUserTicketByTime(firstTime: number, lastTime: number) {
    const tickets = await this.userTicketModel
      .scan('createdAt')
      .ge(firstTime)
      .and()
      .where('createdAt')
      .le(lastTime)
      .exec();

    return tickets;
  }

  async getUserTicketByTimeAndEvent(
    firstTime: number,
    lastTime: number,
    id: string,
  ) {
    const tickets = await this.userTicketModel
      .scan('createdAt')
      .ge(firstTime)
      .and()
      .where('createdAt')
      .le(lastTime)
      .and()
      .where('event')
      .eq(id)
      .exec();

    return tickets;
  }

  async getEventAvailable(currentTime: number) {
    return this.eventModel.scan('ticket.saleEnd').ge(currentTime).exec();
  }

  formatEventData(
    initData: any[],
    currentTime: number,
    subtractType: any,
    formatType: string,
    formatCompare: string,
    tempDate?: moment.Moment,
  ) {
    const formattedData = [];
    for (let i = 0; i <= (subtractType === 'hours' ? 23 : currentTime); i++) {
      const data = {
        time: tempDate
          ? moment(tempDate)
              .subtract(currentTime - i, subtractType)
              .format(formatType)
          : moment()
              .subtract(currentTime - i, subtractType)
              .format(formatType),
        total: initData
          .filter(
            (userTicket) =>
              +moment(userTicket.createdAt).format(formatCompare) ===
              +(subtractType === 'hours'
                ? i
                : tempDate
                ? moment(tempDate)
                    .subtract(currentTime - i, subtractType)
                    .format(formatCompare)
                : moment()
                    .subtract(currentTime - i, subtractType)
                    .format(formatCompare)),
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

  formatDataAnalysisResponse(
    dailyData: any,
    weeklyData: any,
    monthlyData: any,
    allTimeData: any,
    totalAvailableTickets: number,
  ) {
    let dailyRange = [
      {
        min: 0,
        max: 4,
        total: 0,
        time: '00:00AM',
      },
      {
        min: 4,
        max: 8,
        total: 0,
        time: '04:00AM',
      },
      {
        min: 8,
        max: 12,
        total: 0,
        time: '08:00AM',
      },
      {
        min: 12,
        max: 16,
        total: 0,
        time: '12:00PM',
      },
      {
        min: 16,
        max: 20,
        total: 0,
        time: '04:00PM',
      },
      {
        min: 20,
        max: 24,
        total: 0,
        time: '08:00PM',
      },
      {
        min: 24,
        max: 28,
        total: 0,
        time: '12:00AM',
      },
    ];

    dailyData.forEach((data) => {
      dailyRange = dailyRange.map((item) => {
        if (
          +data.time.substr(0, 2) >= item.min &&
          +data.time.substr(0, 2) < item.max
        ) {
          item.total += data.total;
        }
        return item;
      });
    });

    dailyRange = dailyRange.map((item) => {
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
    const cached = await this.redisService.getWithPrefix(
      Caching.EVENT_TICKET_BY_ID,
      id,
    );

    if (cached) {
      return JSON.parse(cached);
    }

    const event = await this.userTicketModel.scan('event').eq(id).exec();

    const populate = await event['populate']();
    const converted = await populate['toJSON']();

    if (event.length) {
      this.redisService.setWithPrefix(
        Caching.EVENT_TICKET_BY_ID,
        id,
        JSON.stringify(converted),
      );
    }

    return converted;
  }

  async getUserTicketByEventIds(ids: string[]) {
    const cached = await this.redisService.getWithPrefix(
      Caching.EVENT_TICKET_BY_IDS,
      ids.join(','),
    );

    if (cached) {
      return JSON.parse(cached);
    }

    const tickets = await this.userTicketModel.scan('event').in(ids).exec();

    const populated = await tickets['populate']();

    if (tickets.length) {
      this.redisService.setWithPrefix(
        Caching.EVENT_TICKET_BY_IDS,
        ids.join(','),
        JSON.stringify(populated),
      );
    }

    return populated || [];
  }

  async getDataByTime(startTime: number, endTime: number) {
    return this.eventModel
      .scan('createdAt')
      .ge(startTime)
      .and()
      .where('createdAt')
      .le(endTime)
      .exec();
  }
}
