"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nft = exports.NftSchema = void 0;
const dynamoose_1 = require("dynamoose");
const user_schema_1 = require("../user/user.schema");
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
    imgLink: {
        type: String,
    },
    metadataPubkey: {
        type: String,
    },
    type: {
        type: String,
    },
    user: user_schema_1.User,
}, {
    timestamps: true,
});
exports.Nft = (0, dynamoose_1.model)('Nft', exports.NftSchema);
//# sourceMappingURL=nft.schema.js.map