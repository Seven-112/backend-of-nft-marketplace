import { nanoid } from 'nanoid';

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
  status: Status;
  constructor() {
    this.id = nanoid(12);
  }
}
