import { Schema, model } from 'dynamoose';

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

export const EventSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
  },
  image: {
    type: String,
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
}, {
  timestamps: true
});

export const Event = model('Event', EventSchema)
