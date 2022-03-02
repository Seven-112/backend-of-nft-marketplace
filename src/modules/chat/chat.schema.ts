import { Schema } from 'dynamoose';

export const ChatSchema = new Schema({
  userId: {
    type: String,
    hashKey: true,
  },
  channels: {
    type: Array,
    schema: [String],
  },
});
