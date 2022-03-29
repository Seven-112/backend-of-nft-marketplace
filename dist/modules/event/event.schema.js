"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventSchema = exports.TicketSchema = void 0;
const dynamoose_1 = require("dynamoose");
exports.TicketSchema = new dynamoose_1.Schema({
    id: {
        type: String,
    },
    name: {
        type: String,
    },
    price: {
        type: Number,
    },
    quantity: {
        type: Number,
    },
    saleStart: {
        type: Date,
    },
    saleEnd: {
        type: Date,
    },
});
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
    ticket: exports.TicketSchema,
    publishDate: {
        type: Date,
    },
});
//# sourceMappingURL=event.schema.js.map