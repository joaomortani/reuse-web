import type { Request, Response } from 'express';
import { ZodError } from 'zod';

import { sendError, sendSuccess } from '../../lib/apiResponse';
import { createItemSchema } from './item.dto';
import { createItem, listItems, listNearbyItems } from './item.service';

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

export const listNearby = async (req: Request, res: Response): Promise<void> => {
  try {
    const lat = getQueryNumber(req.query.lat, Number.NaN);
    const lng = getQueryNumber(req.query.lng, Number.NaN);
    const radius = getQueryNumber(req.query.radius, Number.NaN);

    if (!Number.isFinite(lat) || !Number.isFinite(lng) || !Number.isFinite(radius)) {
      sendError(res, 400, { code: 'VALIDATION_ERROR', message: 'lat, lng and radius must be valid numbers' });
      return;
    }

    const category = getQueryString(req.query.category);

    const items = await listNearbyItems({
      lat,
      lng,
      radius,
      category,
    });

    sendSuccess(res, items);
  } catch (error) {
    sendError(res, 500, { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
  }
};

export const list = async (req: Request, res: Response): Promise<void> => {
  await listAll(req, res);
};
