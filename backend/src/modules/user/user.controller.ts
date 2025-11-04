import type { Request, Response } from 'express';
import { ZodError } from 'zod';

import { registerUserSchema, updateUserSchema } from './user.dto';
import { ConflictError, createUser, listAllUsers, updateMe as updateMeService } from './user.service';
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

export const updateMe = async (req: Request, res: Response): Promise<void> => {
  if (!req.user?.id) {
    sendError(res, 401, { code: 'UNAUTHORIZED', message: 'Unauthorized' });
    return;
  }

  try {
    const data = updateUserSchema.parse(req.body);

    if (Object.keys(data).length === 0) {
      sendError(res, 400, { code: 'VALIDATION_ERROR', message: 'No data provided' });
      return;
    }

    const user = await updateMeService(req.user.id, data);

    sendSuccess(res, user);
  } catch (error) {
    if (error instanceof ZodError) {
      sendError(res, 400, { code: 'VALIDATION_ERROR', message: 'Validation failed' }, {
        errors: error.flatten().fieldErrors,
      });
      return;
    }

    sendError(res, 500, { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
  }
};

export const listUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await listAllUsers();

    sendSuccess(res, users);
  } catch (error) {
    sendError(res, 500, { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
  }
};
