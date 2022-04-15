"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Support = exports.Reply = exports.File = exports.ETicketType = exports.Status = void 0;
const nanoid_1 = require("nanoid");
var Status;
(function (Status) {
    Status["open"] = "open";
    Status["supporting"] = "supporting";
    Status["done"] = "done";
})(Status = exports.Status || (exports.Status = {}));
var ETicketType;
(function (ETicketType) {
    ETicketType["paid"] = "paid";
    ETicketType["free"] = "free";
})(ETicketType = exports.ETicketType || (exports.ETicketType = {}));
class File {
}
exports.File = File;
class Reply {
}
exports.Reply = Reply;
class Support {
    constructor() {
        this.id = (0, nanoid_1.nanoid)(12);
    }
}
exports.Support = Support;
//# sourceMappingURL=support.interface.js.map