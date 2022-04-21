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
    getUserTicketByTime(firstTime: number, lastTime: number): Promise<import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<UserTicket>>>;
    getUserTicketByTimeAndEvent(firstTime: number, lastTime: number, id: string): Promise<import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<UserTicket>>>;
    getEventAvailable(currentTime: number): Promise<import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<Event>>>;
    formatEventData(initData: any[], currentTime: number, subtractType: any, formatType: string, formatCompare: string): any[];
    formatDataAnalysisResponse(dailyData: any, weeklyData: any, monthlyData: any, allTimeData: any, totalAvailableTickets: number): {
        daily: {
            data: any;
            availableTickets: number;
            soldTickets: any;
        };
        weekly: {
            data: any;
            availableTickets: number;
            soldTickets: any;
        };
        monthly: {
            data: any;
            availableTickets: number;
            soldTickets: any;
        };
        allTime: {
            data: any;
            availableTickets: number;
            soldTickets: any;
        };
    };
    getUserTicketByEventId(id: string): Promise<import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<UserTicket>>>;
}
