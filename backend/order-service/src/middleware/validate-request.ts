import type { RequestHandler } from 'express';
import type { ZodSchema } from 'zod';

type ValidationSource = 'body' | 'query' | 'params';

/**
 * Valida `req.body`, `req.query` ou `req.params` com um schema Zod e anexa o resultado tipado.
 */
export const validateRequest = <T>(
  schema: ZodSchema<T>,
  source: ValidationSource
): RequestHandler => {
  return (req, res, next) => {
    const parsed = schema.safeParse(req[source]);
    if (!parsed.success) {
      const flat = parsed.error.flatten();
      res.status(400).json({
        message: 'Dados invalidos',
        errors: flat.fieldErrors,
        formErrors: flat.formErrors,
      });
      return;
    }
    if (source === 'body') {
      req.validatedBody = parsed.data;
    } else if (source === 'query') {
      req.validatedQuery = parsed.data;
    } else {
      req.validatedParams = parsed.data;
    }
    next();
  };
};
