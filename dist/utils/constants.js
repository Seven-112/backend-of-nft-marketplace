"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET = exports.HASH_SECRET_KEY = exports.HASH_SECRET = exports.JWT_EXPIRES_IN = exports.JWT_SECRET = exports.APP_URI = exports.PORT = exports.METHOD = void 0;
const dotenv = require("dotenv");
const crypto = require("crypto");
dotenv.config();
var METHOD;
(function (METHOD) {
    METHOD["PATCH"] = "patch";
    METHOD["GET"] = "get";
    METHOD["POST"] = "post";
    METHOD["PUT"] = "put";
    METHOD["DELETE"] = "delete";
})(METHOD = exports.METHOD || (exports.METHOD = {}));
exports.PORT = process.env.PORT;
exports.APP_URI = process.env.APP_URI;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRES_IN = 1 * 60 * 60 * 24;
exports.HASH_SECRET = process.env.HASH_SECRET;
exports.HASH_SECRET_KEY = process.env.HASH_SECRET_KEY;
exports.SECRET = crypto
    .createHash('sha256')
    .update(exports.HASH_SECRET)
    .digest('base64')
    .substring(0, 32);
//# sourceMappingURL=constants.js.map