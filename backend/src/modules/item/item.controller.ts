import { Prisma } from '@prisma/client';
import type { Request, Response } from 'express';
import { ZodError } from 'zod';

import { sendError, sendSuccess } from '../../lib/apiResponse';
import { createItemSchema } from './item.dto';
import { createItem, listItems, listTopItems } from './item.service';

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

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      sendError(res, 400, { code: 'INVALID_CATEGORY', message: 'Category not found' });
      return;
    }

    sendError(res, 500, { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
  }
};

const getQueryString = (value: unknown): string | undefined => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }

  if (Array.isArray(value) && value.length > 0) {
    const firstValue = value[0];
    if (typeof firstValue === 'string' && firstValue.trim().length > 0) {
      return firstValue.trim();
    }
  }

  return undefined;
};

const getQueryNumber = (value: unknown, defaultValue: number): number => {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const numericValue =
    typeof rawValue === 'string' && rawValue.trim().length > 0 ? Number(rawValue) : Number.NaN;

  if (Number.isFinite(numericValue) && numericValue > 0) {
    return numericValue;
  }

  return defaultValue;
};

export const listAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, Math.floor(getQueryNumber(req.query.page, 1)));
    const limit = Math.max(1, Math.min(50, Math.floor(getQueryNumber(req.query.limit, 10))));

    const category = getQueryString(req.query.category);
    const ownerId = getQueryString(req.query.ownerId);
    const search = getQueryString(req.query.search);

    const items = await listItems({
      page,
      limit,
      category,
      ownerId,
      search,
    });

    sendSuccess(res, items);
  } catch (error) {
    sendError(res, 500, { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
  }
};

export const listTop = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit: limitQuery } = req.query;

    let limit = 5;

    const limitValue = Array.isArray(limitQuery) ? limitQuery[0] : limitQuery;

    if (typeof limitValue === 'string') {
      const parsedLimit = Number.parseInt(limitValue, 10);

      if (!Number.isNaN(parsedLimit) && parsedLimit > 0) {
        limit = parsedLimit;
      }
    }

    const items = await listTopItems(limit);

    sendSuccess(res, items);
  } catch (error) {
    sendError(res, 500, { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
  }
};
