import { nanoid } from 'nanoid';

export type SupportKey = {
  table: string;
  timestamp: number;
}

export enum Status {
  open = 'open',
  supporting = 'supporting',
  done = 'done'
}

export enum ETicketType {
  paid = 'paid',
  free = 'free',
}

export class File {
  extension: string;
  url: string
}

export class Reply {
  user: string;
  username: string;
  email: string;
  content: string;
  timestamp: number;
  file: File;
}

export class Support {
  id: string;
  ticket_uuid: string;
  subject: string;
  description: string;
  email: string;
  category: string;
  blockchain: string;
  transaction_hash: string;
  wallet: string;
  file: File;
  replies: [Reply];
  timestamp: number;
  status: Status;
  table: string;
  constructor() {
    this.id = nanoid(12);
  }
}
