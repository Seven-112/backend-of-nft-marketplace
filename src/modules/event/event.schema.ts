import { Schema } from 'dynamoose';

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
});

export const EventSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
  },
  userId: {
    type: String,
  },
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
  ticket: TicketSchema,
  publishDate: {
    type: Date,
  },
});
