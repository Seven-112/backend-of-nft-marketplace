"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatchlistSchema = void 0;
const dynamoose_1 = require("dynamoose");
exports.WatchlistSchema = new dynamoose_1.Schema({
    id: {
        type: String,
        hashKey: true,
    },
    list: {
        type: Set,
        schema: [String],
        default: [],
    },
});
//# sourceMappingURL=watchlist.schema.js.map