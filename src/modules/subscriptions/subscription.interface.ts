import { nanoid } from 'nanoid';

export class Subscription {
  id: string;
  email: string;
  constructor() {
    this.id = nanoid(12);
  }
}
