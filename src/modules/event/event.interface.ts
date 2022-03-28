import { nanoid } from 'nanoid';

export enum EEventType {
  online = 'online',
  venue = 'venue',
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

  constructor() {
    this.id = nanoid(12);
  }
}
