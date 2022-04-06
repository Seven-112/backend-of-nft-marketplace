"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftSchema = void 0;
const dynamoose_1 = require("dynamoose");
exports.NftSchema = new dynamoose_1.Schema({
    id: {
        type: String,
        hashKey: true,
    },
    title: {
        type: String,
    },
    owner: {
        type: String,
    },
    price: {
        type: Number,
        required: false,
    },
    usdPrice: {
        type: Number,
        required: false,
    },
}, {
    timestamps: true,
});
//# sourceMappingURL=nft.schema.js.map