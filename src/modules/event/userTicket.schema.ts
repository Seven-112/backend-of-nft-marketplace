import { Schema, model } from 'dynamoose';
import { User } from '../user/user.schema';
import { Event } from './event.schema';

export const UserTicketSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
  },
  user: User,
  event: String,
  number_ticket: {
    type: Number
  }
}, {
  timestamps: true
});

export const UserTicket = model('UserTicket', UserTicketSchema);
