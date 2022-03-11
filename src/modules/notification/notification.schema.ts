import { Schema } from 'dynamoose';

export const NotificationSchema = new Schema({
  type: {
    type: String,
  },
  message: {
    type: String,
  },
  messageId: {
    type: String,
    hashKey: true,
  },
  timeStamp: {
    type: String,
  },
  receiver: {
    type: String,
  },
  sender: {
    type: String,
  },
  isRead: {
    type: Boolean,
  },
});
