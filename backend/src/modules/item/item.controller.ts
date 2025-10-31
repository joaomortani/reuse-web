import type { Request, Response } from 'express';
import { ZodError } from 'zod';

import { sendError, sendSuccess } from '../../lib/apiResponse';
import { createItemSchema } from './item.dto';
import { createItem, listItems } from './item.service';

export const create = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    sendError(res, 401, { code: 'UNAUTHORIZED', message: 'Unauthorized' });
    return;
  }

  try {
    const payload = createItemSchema.parse(req.body);

    const item = await createItem(req.user.id, payload);

    sendSuccess(res, item, 201);
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

export const list = async (_req: Request, res: Response): Promise<void> => {
  try {
    const items = await listItems();

    sendSuccess(res, items);
  } catch (error) {
    sendError(res, 500, { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
  }
};
