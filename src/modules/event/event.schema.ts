import { Schema, model } from 'dynamoose';
import { User } from '../user/user.schema';

export const TicketSchema = new Schema({
  id: {
    type: String,
  },
  type: {
    type: String,
    enum: ['paid', 'free'],
  },
  name: {
    type: String,
  },
  price: {
    type: Number,
  },
  quantity: {
    type: Number,
  },
  saleStart: {
    type: Date,
  },
  saleEnd: {
    type: Date,
  },
  remain: {
    type: Number,
  },
});

export const EventSchema = new Schema(
  {
    id: {
      type: String,
    },
    image: {
      type: String,
    },
    user: User,
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    type: {
      type: String,
      enum: ['online', 'venue'],
    },
    location: {
      type: String,
    },
    table: {
      type: String,
      default: 'event',
      hashKey: true,
    },
    timestamp: {
      type: Number,
      rangeKey: true
    },
    ticket: TicketSchema,
    publishDate: {
      type: Date,
    },
    createdAt: {
      type: Number
    },
    updatedAt: {
      type: Number
    }
  }
);

export const Event = model('Event', EventSchema);
