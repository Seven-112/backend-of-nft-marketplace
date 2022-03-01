import { Schema } from 'dynamoose';

export const NotificationSchema = new Schema({
  type: {
    type: String,
  },
  messageId: {
    type: String,
    hashKey: true,
  },
  topicArn: {
    type: String,
  },
  message: {
    type: String,
  },
  timestamp: {
    type: Date,
  },
  signatureVersion: {
    type: String,
  },
  signature: {
    type: String,
  },
  signingCertURL: {
    type: String,
  },
  unsubscribeURL: {
    type: String,
  },
});
