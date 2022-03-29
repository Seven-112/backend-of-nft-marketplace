import { nanoid } from 'nanoid';

export enum EEventType {
  online = 'online',
  venue = 'venue',
}

export class Ticket {
  id: string;
  name: string;
  price: number;
  quantity: number;
  saleStart: Date;
  saleEnd: Date;
}

export class Event {
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

  constructor() {
    this.id = nanoid(12);
  }
}
