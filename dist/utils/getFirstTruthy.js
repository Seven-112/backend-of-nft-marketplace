"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getFirstTruthy(data) {
    let result = null;
    for (const value of data) {
        if (Boolean(value)) {
            result = value;
            break;
        }
    }
    return result;
}
exports.default = getFirstTruthy;
//# sourceMappingURL=getFirstTruthy.js.map