import { Schema } from 'dynamoose';

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
});
