import { UserService } from '../user/user.service';
import { CreateEventDTO, UpdateEventDTO } from './DTO/create-event.dto';
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
            events: import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<Event>>;
            length: number;
        };
    }>;
    getEventById(id: string): Promise<{
        code: number;
        message: string;
        data: import("nestjs-dynamoose").Document<Event>;
    }>;
}
