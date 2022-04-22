import { nanoid } from 'nanoid';

export type EventKey = {
  table: string;
  timestamp: number;
}


export enum EEventType {
  online = 'online',
  venue = 'venue',
}

export enum ETicketType {
  paid = 'paid',
  free = 'free',
}

export class Ticket {
  id: string;
  type: ETicketType;
  name: string;
  price: number;
  quantity: number;
  saleStart: Date;
  saleEnd: Date;
  remain: number;

  constructor() {
    this.id = nanoid(12);
  }
}

export class Event {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  type: EEventType;
  location: string;
  user: string;
  publishDate: Date;
  ticket: Ticket;
  createdAt: number;
  updatedAt: number;
  timestamp: number;
  table: string;
  boughtTicketUsers?: any;
  constructor() {
    this.id = nanoid(12);
  }
}
