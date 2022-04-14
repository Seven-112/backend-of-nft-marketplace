"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Support = exports.SupportSchema = exports.Reply = exports.FileSchema = void 0;
const dynamoose_1 = require("dynamoose");
const user_schema_1 = require("../user/user.schema");
exports.FileSchema = new dynamoose_1.Schema({
    extension: {
        type: String,
    },
    url: {
        type: String,
    }
});
const ReplySchema = new dynamoose_1.Schema({
    user: user_schema_1.User,
    username: String,
    email: String,
    content: String,
    file: exports.FileSchema,
    timestamp: Number
});
exports.Reply = (0, dynamoose_1.model)('replies', ReplySchema);
exports.SupportSchema = new dynamoose_1.Schema({
    id: {
        type: String,
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
    table: {
        type: String,
        default: 'support',
        hashKey: true
    },
    replies: {
        type: Array,
        schema: [{
                type: Object,
                schema: ReplySchema,
                model: exports.Reply,
            }],
        default: []
    },
    status: {
        type: String,
        default: 'open',
        required: false
    }
}, {
    timestamps: true,
});
exports.Support = (0, dynamoose_1.model)('Supports', exports.SupportSchema);
//# sourceMappingURL=support.schema.js.map