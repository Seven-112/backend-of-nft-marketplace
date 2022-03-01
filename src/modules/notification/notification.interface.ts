export interface Notification {
  Type: string;
  MessageId: string;
  TopicArn: string;
  Message: string;
  Timestamp: Date;
  SignatureVersion: string;
  Signature: string;
  SigningCertURL: string;
  UnsubscribeURL: string;
}
