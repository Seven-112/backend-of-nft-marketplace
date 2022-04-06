"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = exports.Ticket = exports.ETicketType = exports.EEventType = void 0;
const nanoid_1 = require("nanoid");
var EEventType;
(function (EEventType) {
    EEventType["online"] = "online";
    EEventType["venue"] = "venue";
})(EEventType = exports.EEventType || (exports.EEventType = {}));
var ETicketType;
(function (ETicketType) {
    ETicketType["paid"] = "paid";
    ETicketType["free"] = "free";
})(ETicketType = exports.ETicketType || (exports.ETicketType = {}));
class Ticket {
    constructor() {
        this.id = (0, nanoid_1.nanoid)(12);
    }
}
exports.Ticket = Ticket;
class Event {
    constructor() {
        this.id = (0, nanoid_1.nanoid)(12);
    }
}
exports.Event = Event;
//# sourceMappingURL=event.interface%20copy.js.map