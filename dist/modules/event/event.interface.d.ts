export declare enum EEventType {
    online = "online",
    venue = "venue"
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
    constructor();
}
