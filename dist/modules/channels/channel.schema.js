"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Support = exports.ChannelSchema = void 0;
const dynamoose_1 = require("dynamoose");
const user_schema_1 = require("../user/user.schema");
exports.ChannelSchema = new dynamoose_1.Schema({
    id: {
        type: String,
    },
    from: user_schema_1.User,
    to: user_schema_1.User,
    name: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Number,
        default: new Date().getTime()
    }
}, {
    timestamps: true,
});
exports.Support = (0, dynamoose_1.model)('Channels', exports.ChannelSchema);
//# sourceMappingURL=channel.schema.js.map