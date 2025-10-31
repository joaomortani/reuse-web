import { Prisma } from '@prisma/client';
import type { Request, Response } from 'express';
import { ZodError } from 'zod';

import prisma from '../../lib/prisma';
import { sendError, sendSuccess } from '../../lib/apiResponse';
import { createCategorySchema } from './category.dto';
import { createCategory, listCategories } from './category.service';

export const create = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    sendError(res, 401, { code: 'UNAUTHORIZED', message: 'Unauthorized' });
    return;
  }

  try {
    const payload = createCategorySchema.parse(req.body);

    const requester = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { role: true },
    });

    if (!requester || requester.role !== 'admin') {
      sendError(res, 403, { code: 'FORBIDDEN', message: 'Only administrators can create categories' });
      return;
    }

    const category = await createCategory(payload);

    sendSuccess(res, category, 201);
  } catch (error) {
    if (error instanceof ZodError) {
      sendError(res, 400, { code: 'VALIDATION_ERROR', message: 'Validation failed' }, {
        errors: error.flatten().fieldErrors,
      });
      return;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      sendError(res, 409, { code: 'CONFLICT', message: 'Category already exists' });
      return;
    }

    sendError(res, 500, { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
  }
};

export const list = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await listCategories();

    sendSuccess(res, categories);
  } catch (error) {
    sendError(res, 500, { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
  }
};
