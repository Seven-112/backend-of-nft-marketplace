"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletSchema = void 0;
const dynamoose_1 = require("dynamoose");
const model_1 = require("../../common/model");
exports.WalletSchema = new dynamoose_1.Schema(Object.assign(Object.assign({}, model_1.baseSchema), { userId: {
        type: String,
        required: true,
        index: {
            name: 'walletUserIdIndex',
            global: true,
        },
    }, address: {
        type: String,
        required: true,
        index: {
            name: 'walletAddressIndex',
            global: true,
        },
    }, type: {
        type: String,
        required: true,
    } }));
//# sourceMappingURL=wallet.schema.js.map