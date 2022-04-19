"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTicket = void 0;
const nanoid_1 = require("nanoid");
class UserTicket {
    constructor() {
        this.id = (0, nanoid_1.nanoid)(12);
    }
}
exports.UserTicket = UserTicket;
//# sourceMappingURL=userTicket.interface.js.map