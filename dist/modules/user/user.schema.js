"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = exports.UserWalletSchema = void 0;
const dynamoose_1 = require("dynamoose");
const model_1 = require("../../common/model");
const user_interface_1 = require("./user.interface");
exports.UserWalletSchema = new dynamoose_1.Schema({
    address: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
});
exports.UserSchema = new dynamoose_1.Schema(Object.assign(Object.assign({}, model_1.baseSchema), { username: {
        type: String,
    }, firstName: {
        type: String,
    }, lastName: {
        type: String,
    }, email: {
        type: String,
        required: true,
        index: {
            name: 'emailIndex',
            global: true,
        },
    }, isActive: {
        type: Boolean,
        default: true,
    }, password: {
        type: String,
    }, roles: {
        type: Array,
        schema: [String],
    }, wallets: {
        type: Array,
        schema: [exports.UserWalletSchema],
    }, type: {
        type: String,
        enum: Object.keys(user_interface_1.UserType),
    }, social: {
        type: Object,
        schema: {
            facebookId: {
                type: String,
            },
            googleId: {
                type: String,
            },
            twitterId: {
                type: String,
            },
        },
        default: {},
    } }));
//# sourceMappingURL=user.schema.js.map