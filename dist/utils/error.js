"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadInputError = exports.NotFoundError = exports.HttpError = void 0;
const toJSON = function toJson() {
    const e = {};
    Object.getOwnPropertyNames(this).forEach((key) => {
        if (key === 'stack')
            return;
        e[key] = this[key];
    });
    return e;
};
class HttpError extends Error {
    constructor(status, message, data) {
        super(message);
        this.status = status;
        this.data = data;
        this.toJSON = toJSON.bind(this);
        this.name = 'HttpError';
    }
}
exports.HttpError = HttpError;
class NotFoundError extends HttpError {
    constructor(entity, data) {
        super(404, 'error.entity_not_found', Object.assign({ entity }, data));
        this.name = 'NotFoundError';
    }
}
exports.NotFoundError = NotFoundError;
class BadInputError extends HttpError {
    constructor(i18nKey, data) {
        super(400, i18nKey, data);
    }
}
exports.BadInputError = BadInputError;
//# sourceMappingURL=error.js.map