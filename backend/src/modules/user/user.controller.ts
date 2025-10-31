import type { Request, Response } from 'express';
import { ZodError } from 'zod';

import { registerUserSchema } from './user.dto';
import { ConflictError, createUser } from './user.service';
import { sendError, sendSuccess } from '../../lib/apiResponse';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = registerUserSchema.parse(req.body);

    const user = await createUser(data);

    sendSuccess(res, user, 201);
  } catch (error) {
    if (error instanceof ZodError) {
      sendError(res, 400, { code: 'VALIDATION_ERROR', message: 'Validation failed' }, {
        errors: error.flatten().fieldErrors,
      });
      return;
    }

    if (error instanceof ConflictError) {
      sendError(res, 409, { code: 'CONFLICT', message: error.message });
      return;
    }

    sendError(res, 500, { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
  }
};
