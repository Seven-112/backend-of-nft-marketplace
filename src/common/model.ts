import { nanoid } from 'nanoid';

export class BaseModel {
  id: string;
  createdAt: number;
  updatedAt: number;
  updatedBy: any;

  constructor() {
    this.id = nanoid(12);
    this.createdAt = new Date().getTime();
    this.updatedAt = new Date().getTime();
  }
}

export const baseSchema = {
  id: {
    type: String,
    hashKey: true,
  },
  createdAt: {
    type: Number,
  },
  updatedAt: {
    type: Number,
  },
  updatedBy: {
    type: Object,
    schema: {
      userId: {
        type: Number,
      },
      username: {
        type: String,
      },
    },
  },
};
