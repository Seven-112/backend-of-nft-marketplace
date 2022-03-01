"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationSchema = void 0;
const dynamoose_1 = require("dynamoose");
exports.NotificationSchema = new dynamoose_1.Schema({
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
//# sourceMappingURL=notification.schema.js.map