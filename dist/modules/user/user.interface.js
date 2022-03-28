"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStatus = exports.UserRole = void 0;
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
//# sourceMappingURL=user.interface.js.map