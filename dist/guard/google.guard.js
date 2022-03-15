"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
class GoogleGuard extends (0, passport_1.AuthGuard)('google') {
    constructor() {
        super();
    }
    handleRequest(err, user, info) {
        if (err || !user) {
            throw err || new common_1.UnauthorizedException();
        }
        console.log(user);
        return user;
    }
}
exports.GoogleGuard = GoogleGuard;
//# sourceMappingURL=google.guard.js.map