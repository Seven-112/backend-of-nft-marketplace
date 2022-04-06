"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = exports.EventSchema = exports.TicketSchema = void 0;
const dynamoose_1 = require("dynamoose");
exports.TicketSchema = new dynamoose_1.Schema({
    id: {
        type: String,
    },
    type: {
        type: String,
        enum: ['paid', 'free'],
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
    remain: {
        type: Number,
    },
});
exports.EventSchema = new dynamoose_1.Schema({
    id: {
        type: String,
        hashKey: true,
    },
    image: {
        type: String,
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
}, {
    timestamps: true
});
exports.Event = (0, dynamoose_1.model)('Event', exports.EventSchema);
//# sourceMappingURL=event.schema.js.map