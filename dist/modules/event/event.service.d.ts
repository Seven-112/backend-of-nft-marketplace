import { UserTicket } from './userTicket.interface';
import { Model } from 'nestjs-dynamoose';
import { Event } from './event.interface';
export declare class EventService {
    private readonly eventModel;
    private readonly userTicketModel;
    constructor(eventModel: Model<Event, Event['id']>, userTicketModel: Model<UserTicket, UserTicket['id']>);
    createEvent(event: Event): Promise<import("nestjs-dynamoose").Document<Event>>;
    getEventById(id: string): Promise<import("nestjs-dynamoose").Document<Event>>;
    getAllEvents(limit?: number): Promise<import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<Event>>>;
    updateEvent(id: string, body: any): Promise<import("nestjs-dynamoose").Document<Event>>;
    createUserTicket(userTicket: UserTicket): Promise<import("nestjs-dynamoose").Document<UserTicket>>;
}
