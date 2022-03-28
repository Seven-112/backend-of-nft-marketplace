import { Model } from 'nestjs-dynamoose';
import { Event } from './event.interface';
export declare class EventService {
    private readonly eventModel;
    constructor(eventModel: Model<Event, Event['id']>);
    createEvent(event: Event): Promise<import("nestjs-dynamoose").Document<Event>>;
    getEventById(id: string): Promise<import("nestjs-dynamoose").Document<Event>>;
    getAllEvents(): Promise<import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<Event>>>;
}
