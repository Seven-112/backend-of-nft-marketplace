"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserRoles = exports.UserType = void 0;
const model_1 = require("../../common/model");
var UserType;
(function (UserType) {
    UserType["email"] = "email";
    UserType["google"] = "google";
    UserType["facebook"] = "facebook";
    UserType["twitter"] = "twitter";
})(UserType = exports.UserType || (exports.UserType = {}));
var UserRoles;
(function (UserRoles) {
    UserRoles["guest"] = "guest";
    UserRoles["user"] = "user";
    UserRoles["admin"] = "admin";
})(UserRoles = exports.UserRoles || (exports.UserRoles = {}));
class User extends model_1.BaseModel {
    constructor({ username, firstName, lastName, email, password, social, type = UserType.email, roles = [UserRoles.guest], }) {
        super();
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.type = type;
        this.roles = roles;
        this.wallets = [];
        this.social = social;
    }
}
exports.User = User;
//# sourceMappingURL=user.interface.js.map