"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTicket = exports.UserTicketSchema = void 0;
const dynamoose_1 = require("dynamoose");
const user_schema_1 = require("../user/user.schema");
exports.UserTicketSchema = new dynamoose_1.Schema({
    id: {
        type: String,
        hashKey: true,
    },
    user: user_schema_1.User,
    event: String,
    number_ticket: {
        type: Number
    }
}, {
    timestamps: true
});
exports.UserTicket = (0, dynamoose_1.model)('UserTicket', exports.UserTicketSchema);
//# sourceMappingURL=userTicket.schema.js.map