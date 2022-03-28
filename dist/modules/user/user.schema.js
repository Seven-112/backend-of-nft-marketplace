"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const dynamoose_1 = require("dynamoose");
exports.UserSchema = new dynamoose_1.Schema({
    id: {
        type: String,
        hashKey: true,
    },
    walletAddress: {
        type: String,
        required: false,
    },
    email: {
        type: String,
    },
    username: {
        type: String,
        required: false,
    },
    job: {
        type: String,
        required: false,
    },
    personalWebsite: {
        type: String,
        required: false,
    },
    phoneNumber: {
        type: String,
        required: false,
    },
    timezone: {
        type: String,
        required: false,
    },
    avatar: {
        type: String,
        required: false,
    },
    role: {
        type: String,
    },
});
//# sourceMappingURL=user.schema.js.map