import { EEventType } from '../event.interface';
export declare class CreateEventDTO {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    type: EEventType;
    location: string;
}
