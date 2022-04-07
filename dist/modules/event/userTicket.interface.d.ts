import { User } from '../user/user.interface';
import { Event } from './event.interface';
export declare class UserTicket {
    id: string;
    event: Event;
    user: User;
    number_ticket: number;
    constructor();
}
