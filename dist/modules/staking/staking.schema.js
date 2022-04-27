"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = exports.StakingSchema = void 0;
const dynamoose_1 = require("dynamoose");
exports.StakingSchema = new dynamoose_1.Schema({
    id: {
        type: String,
    },
    type: {
        type: String,
        enum: ['staking', 'unstaking'],
    },
    amount: {
        type: Number,
    },
    stakedTime: {
        type: Number,
    },
    wallet: {
        type: String,
    }
}, {
    timestamps: true
});
exports.Event = (0, dynamoose_1.model)('Event', exports.StakingSchema);
//# sourceMappingURL=staking.schema.js.map