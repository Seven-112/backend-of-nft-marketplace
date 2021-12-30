const toJSON: (this: Error) => Record<string, any> = function toJson() {
  const e = {} as Record<string, any>;
  Object.getOwnPropertyNames(this).forEach((key: string) => {
    if (key === 'stack') return;
    e[key] = this[key as keyof Error];
  });
  return e;
};

export class HttpError extends Error {
  toJSON = toJSON.bind(this);
  constructor(public status: number, message?: string, public data?: any) {
    super(message);
    this.name = 'HttpError';
  }
}

export class NotFoundError extends HttpError {
  constructor(entity: 'todo' | string, data: any) {
    super(404, 'error.entity_not_found', { entity, ...data });
    this.name = 'NotFoundError';
  }
}

export class BadInputError extends HttpError {
  constructor(i18nKey: string, data?: any) {
    super(400, i18nKey, data);
  }
}
