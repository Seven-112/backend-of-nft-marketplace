import { UserTicket } from './userTicket.interface';
import { Model } from 'nestjs-dynamoose';
import { Event, EventKey } from './event.interface';
import * as moment from 'moment';
import { RedisService } from '../redis/redis.service';
export declare class EventService {
    private readonly eventModel;
    private readonly userTicketModel;
    private readonly redisService;
    constructor(eventModel: Model<Event, EventKey>, userTicketModel: Model<UserTicket, UserTicket['id']>, redisService: RedisService);
    clear(): void;
    createEvent(event: Event): Promise<import("nestjs-dynamoose").Document<Event>>;
    getEventById(id: string): Promise<any>;
    getAllEvents(limit?: number, populate?: boolean): Promise<any>;
    updateEvent(eventKey: EventKey, body: any): Promise<import("nestjs-dynamoose").Document<Event>>;
    createUserTicket(userTicket: UserTicket): Promise<import("nestjs-dynamoose").Document<UserTicket>>;
    getUserTicketByTime(firstTime: number, lastTime: number): Promise<import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<UserTicket>>>;
    getUserTicketByTimeAndEvent(firstTime: number, lastTime: number, id: string): Promise<import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<UserTicket>>>;
    getEventAvailable(currentTime: number): Promise<import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<Event>>>;
    formatEventData(initData: any[], currentTime: number, subtractType: any, formatType: string, formatCompare: string, tempDate?: moment.Moment): any[];
    formatDataAnalysisResponse(dailyData: any, weeklyData: any, monthlyData: any, allTimeData: any, totalAvailableTickets: number): {
        daily: {
            data: {
                min: number;
                max: number;
                total: number;
                time: string;
            }[];
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
    getUserTicketByEventId(id: string): Promise<any>;
    getUserTicketByEventIds(ids: string[]): Promise<any>;
    getDataByTime(startTime: number, endTime: number): Promise<import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<Event>>>;
}
