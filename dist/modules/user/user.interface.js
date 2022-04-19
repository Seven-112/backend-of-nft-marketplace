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
    UserStatus["active"] = "active";
    UserStatus["banned"] = "banned";
    UserStatus["freeze"] = "freeze";
    UserStatus["nft_owner"] = "nft owner";
})(UserStatus = exports.UserStatus || (exports.UserStatus = {}));
class Social {
}
exports.Social = Social;
class User {
}
exports.User = User;
//# sourceMappingURL=user.interface.js.map