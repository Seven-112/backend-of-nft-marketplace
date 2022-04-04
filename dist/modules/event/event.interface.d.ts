export declare enum EEventType {
    online = "online",
    venue = "venue"
}
export declare enum ETicketType {
    paid = "paid",
    free = "free"
}
export declare class Ticket {
    id: string;
    type: ETicketType;
    name: string;
    price: number;
    quantity: number;
    saleStart: Date;
    saleEnd: Date;
    sold: number;
    constructor();
}
export declare class Event {
    id: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    type: EEventType;
    location: string;
    userId: string;
    publishDate: Date;
    ticket: Ticket;
    constructor();
}
