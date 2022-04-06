"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSchema = void 0;
const dynamoose_1 = require("dynamoose");
exports.ChatSchema = new dynamoose_1.Schema({
    userId: {
        type: String,
        hashKey: true,
    },
    channels: {
        type: Array,
        schema: [String],
    },
});
//# sourceMappingURL=chat.schema.js.map