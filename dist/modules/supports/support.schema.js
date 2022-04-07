"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Support = exports.SupportSchema = exports.FileSchema = void 0;
const dynamoose_1 = require("dynamoose");
exports.FileSchema = new dynamoose_1.Schema({
    extension: {
        type: String,
    },
    url: {
        type: String,
    }
});
exports.SupportSchema = new dynamoose_1.Schema({
    id: {
        type: String,
        hashKey: true,
    },
    ticket_uuid: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    blockchain: {
        type: String,
        required: true
    },
    transaction_hash: {
        type: String,
        required: true
    },
    wallet: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    file: exports.FileSchema,
    timestamp: {
        type: Number,
        rangeKey: true
    },
    status: {
        type: String,
        default: 'open',
        required: false
    }
}, {
    timestamps: true,
});
exports.Support = (0, dynamoose_1.model)('Support', exports.SupportSchema);
//# sourceMappingURL=support.schema.js.map