import { EEventType, ETicketType } from '../staking.interface';
export declare class TicketDTO {
    name: string;
    type: ETicketType;
    price: number;
    quantity: number;
    saleStart: Date;
    saleEnd: Date;
}
export declare class UpdateTicketDTO extends TicketDTO {
    id: string;
    sold: number;
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
export declare class UpdateEventDTO extends CreateEventDTO {
    id: string;
    userId: string;
    createdAt: Date;
    ticket: UpdateTicketDTO;
}
