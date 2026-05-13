import type { RequestHandler } from "express";
import type { ZodTypeAny } from "zod";

interface ValidationSchemas {
  body?: ZodTypeAny;
  params?: ZodTypeAny;
  query?: ZodTypeAny;
}

export function validate(schemas: ValidationSchemas): RequestHandler {
  return (request, _response, next) => {
    if (schemas.body) {
      request.body = schemas.body.parse(request.body);
    }

    if (schemas.params) {
      Object.assign(request.params, schemas.params.parse(request.params));
    }

    if (schemas.query) {
      Object.assign(
        request.query as Record<string, unknown>,
        schemas.query.parse(request.query)
      );
    }

    next();
  };
}
