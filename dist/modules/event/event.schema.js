"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventSchema = void 0;
const dynamoose_1 = require("dynamoose");
exports.EventSchema = new dynamoose_1.Schema({
    id: {
        type: String,
        hashKey: true,
    },
    userId: {
        type: String,
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    type: {
        type: String,
        enum: ['online', 'venue'],
    },
    location: {
        type: String,
    },
});
//# sourceMappingURL=event.schema.js.map