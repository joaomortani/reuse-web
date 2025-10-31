import prisma from '../../lib/prisma';
import type { ItemDTO } from './item.dto';

export interface ItemResponse {
  id: string;
  title: string;
  description: string;
  lat: number;
  lng: number;
  createdAt: Date;
}

export const createItem = async (
  userId: string,
  data: ItemDTO,
): Promise<ItemResponse> => {
  const item = await prisma.item.create({
    data: {
      title: data.title,
      description: data.description,
      lat: data.lat,
      lng: data.lng,
      ownerId: userId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      lat: true,
      lng: true,
      createdAt: true,
    },
  });

  return item;
};

export const listMyItems = async (userId: string): Promise<ItemResponse[]> => {
  const items = await prisma.item.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      description: true,
      lat: true,
      lng: true,
      createdAt: true,
    },
  });

  return items;
};
