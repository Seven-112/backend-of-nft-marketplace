import { Schema } from 'dynamoose';

export const NotificationSchema = new Schema({
  Type: {
    type: String,
  },
  Subject: {
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
    type: String,
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
