import type { Request, Response } from 'express';
import { ZodError } from 'zod';

import { itemSchema } from './item.dto';
import { createItem as createItemService, listMyItems } from './item.service';

export const createItem = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const data = itemSchema.parse(req.body);
    const item = await createItemService(req.user.id, data);

    res.status(201).json(item);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        message: 'Validation failed',
        errors: error.flatten().fieldErrors,
      });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMyItems = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const items = await listMyItems(req.user.id);

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
