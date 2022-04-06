import { nanoid } from 'nanoid';
import { User } from '../user/user.interface';
import { Event } from './event.interface';

export class UserTicket {
  id: string;
  event: Event;
  user: User;
  number_ticket: number;

  constructor() {
    this.id = nanoid(12);
  }
}
