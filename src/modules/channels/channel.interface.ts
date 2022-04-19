import { nanoid } from 'nanoid';

export class Channel {
  id: string;
  from: string;
  to: string;
  name: string;
  timestamp: number;
  constructor() {
    this.id = nanoid(12);
  }
}
