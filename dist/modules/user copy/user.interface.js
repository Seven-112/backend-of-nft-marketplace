"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.Social = exports.UserStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["Admin"] = "admin";
    UserRole["Creator"] = "creator";
    UserRole["User"] = "user";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["creator"] = "creator";
    UserStatus["admin"] = "admin";
    UserStatus["user"] = "user";
    UserStatus["active"] = "active";
    UserStatus["inactive"] = "inactive";
})(UserStatus = exports.UserStatus || (exports.UserStatus = {}));
class Social {
}
exports.Social = Social;
class User {
}
exports.User = User;
//# sourceMappingURL=user.interface.js.map