import { UserTicket } from './userTicket.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Event } from './event.interface';

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
}
