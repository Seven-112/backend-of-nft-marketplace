import { UserService } from '../user/user.service';
import { CreateEventDTO, UpdateEventDTO } from './DTO/create-event.dto';
import { BuyTicketDTO } from './DTO/buyTicket.dto';
import { Event } from './event.interface';
import { EventService } from './event.service';
export declare class EventController {
    private readonly eventService;
    private readonly userService;
    constructor(eventService: EventService, userService: UserService);
    createEvent(request: any, body: CreateEventDTO): Promise<{
        code: number;
        message: string;
        data: import("nestjs-dynamoose").Document<Event>;
    }>;
    updateEvent(request: any, body: UpdateEventDTO): Promise<{
        code: number;
        message: string;
        data?: undefined;
    } | {
        code: number;
        message: string;
        data: import("nestjs-dynamoose").Document<Event>;
    }>;
    getEvents(limit?: number): Promise<{
        code: number;
        message: string;
        data: {
            events: any[] | import("nestjs-dynamoose").QueryResponse<import("nestjs-dynamoose").Document<Event>>;
            length: number;
        };
    }>;
    getEventAnalisys(request: any): Promise<{
        code: number;
        message: string;
        data: {
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
    }>;
    getEventById(id: string): Promise<{
        code: number;
        message: string;
        data?: undefined;
    } | {
        code: number;
        message: string;
        data: any;
    }>;
    eventAnalysis(id: string, relations?: string[]): Promise<{
        error: number;
        message: string;
        code?: undefined;
        data?: undefined;
    } | {
        code: number;
        message: string;
        data: {
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
        error?: undefined;
    }>;
    buyEventTicket(id: string, request: any, body: BuyTicketDTO): Promise<{
        code: number;
        message: string;
        data: any;
    }>;
}
