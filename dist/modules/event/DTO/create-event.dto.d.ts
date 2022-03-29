import { EEventType } from '../event.interface';
export declare class TicketDTO {
    name: string;
    price: Number;
    quantity: Number;
    saleStart: Date;
    saleEnd: Date;
}
export declare class CreateEventDTO {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    type: EEventType;
    location: string;
    publishDate: Date;
    ticket: TicketDTO;
}
