export interface Notification {
    type: string;
    messageId: string;
    topicArn: string;
    message: string;
    timestamp: Date;
    signatureVersion: string;
    signature: string;
    signingCertURL: string;
    unsubscribeURL: string;
}
