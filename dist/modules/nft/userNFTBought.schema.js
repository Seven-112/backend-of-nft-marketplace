"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserNFTBought = exports.UserNFTBoughtSchema = void 0;
const dynamoose_1 = require("dynamoose");
const user_schema_1 = require("../user/user.schema");
const nft_schema_1 = require("./nft.schema");
exports.UserNFTBoughtSchema = new dynamoose_1.Schema({
    id: {
        type: String,
        hashKey: true,
    },
    user: user_schema_1.User,
    nft: nft_schema_1.Nft,
}, {
    timestamps: true
});
exports.UserNFTBought = (0, dynamoose_1.model)('UserNFTBought', exports.UserNFTBoughtSchema);
//# sourceMappingURL=userNFTBought.schema.js.map