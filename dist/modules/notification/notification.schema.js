"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationSchema = void 0;
const dynamoose_1 = require("dynamoose");
exports.NotificationSchema = new dynamoose_1.Schema({
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
        required: false,
    },
});
//# sourceMappingURL=notification.schema.js.map