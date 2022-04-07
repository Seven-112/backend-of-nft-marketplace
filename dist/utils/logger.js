"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultPinoOptions = void 0;
exports.defaultPinoOptions = {
    prettyPrint: process.env.NODE_ENV !== 'production'
        ? { colorize: true, translateTime: true }
        : false,
    level: 'info',
};
//# sourceMappingURL=logger.js.map