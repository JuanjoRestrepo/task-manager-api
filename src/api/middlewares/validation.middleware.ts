import { Request, Response, NextFunction } from 'express';
import Ajv, { ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

function formatErrors(errors?: ErrorObject[] | null) {
  const errorList = errors ?? [];

  return errorList.map((err) => {
    const field = err.instancePath
      ? err.instancePath.replace('/', '')
      : (err.params as any)?.missingProperty || 'unknown';

    switch (err.keyword) {
      case 'required':
        return {
          field: (err.params as any).missingProperty,
          message: 'is required',
        };

      case 'enum':
        return {
          field,
          message: `must be one of: ${(err.params as any).allowedValues.join(', ')}`,
        };

      case 'type':
        return {
          field,
          message: `must be of type ${(err.params as any).type}`,
        };

      case 'additionalProperties':
        return {
          field: (err.params as any).additionalProperty,
          message: 'is not allowed',
        };

      case 'format':
        return {
          field,
          message: `must be a valid ${err.params.format}`,
        };

      default:
        return {
          field,
          message: err.message || 'is invalid',
        };
    }
  });
}

export const validate = (schema: object) => {
  const validateFn = ajv.compile(schema);

  return (req: Request, res: Response, next: NextFunction) => {
    const valid = validateFn(req.body);

    if (!valid) {
      return res.status(400).json({
        error: 'ValidationError',
        message: 'Invalid request data',
        errors: formatErrors(validateFn.errors),
      });
    }

    next();
  };
};
