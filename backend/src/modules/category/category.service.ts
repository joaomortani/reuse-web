import type { Category } from '@prisma/client';

import prisma from '../../lib/prisma';
import type { CreateCategoryDTO } from './category.dto';

export type CategoryResponse = Pick<Category, 'id' | 'name'>;

export const createCategory = async (data: CreateCategoryDTO): Promise<CategoryResponse> => {
  const category = await prisma.category.create({
    data: {
      name: data.name,
    },
    select: {
      id: true,
      name: true,
    },
  });

  return category;
};

export const listCategories = async (): Promise<CategoryResponse[]> => {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
    },
  });

  return categories;
};
