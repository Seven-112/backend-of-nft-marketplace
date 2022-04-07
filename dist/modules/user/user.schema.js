"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserSchema = exports.SocialSchema = void 0;
const dynamoose_1 = require("dynamoose");
exports.SocialSchema = new dynamoose_1.Schema({
    youtube: {
        type: String,
        required: false,
    },
    facebook: {
        type: String,
        required: false,
    },
    twitter: {
        type: String,
        required: false,
    },
    instagram: {
        type: String,
        required: false,
    },
    discord: {
        type: String,
        required: false,
    },
    telegram: {
        type: String,
        required: false,
    },
});
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
    status: {
        type: String,
    },
    createdAt: {
        type: String,
    },
    social: exports.SocialSchema,
});
exports.User = (0, dynamoose_1.model)('User', exports.UserSchema);
//# sourceMappingURL=user.schema.js.map