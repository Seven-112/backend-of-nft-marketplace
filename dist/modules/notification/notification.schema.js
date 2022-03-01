"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationSchema = void 0;
const dynamoose_1 = require("dynamoose");
exports.NotificationSchema = new dynamoose_1.Schema({
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
//# sourceMappingURL=notification.schema.js.map