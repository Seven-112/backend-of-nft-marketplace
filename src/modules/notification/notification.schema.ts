import { Schema } from 'dynamoose';

export const NotificationSchema = new Schema({
  Type: {
    type: String,
  },
  MessageId: {
    type: String,
    hashKey: true,
  },
  TopicArn: {
    type: String,
  },
  Message: {
    type: String,
  },
  Timestamp: {
    type: Date,
  },
  SignatureVersion: {
    type: String,
  },
  Signature: {
    type: String,
  },
  signingCertURL: {
    type: String,
  },
  UnsubscribeURL: {
    type: String,
  },
});
