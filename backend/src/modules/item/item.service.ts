import prisma from '../../lib/prisma';
import type { CreateItemDTO } from './item.dto';

export interface ItemWithOwner {
  id: string;
  title: string;
  description: string;
  lat: number;
  lng: number;
  ownerId: string;
  createdAt: Date;
  owner: {
    id: string;
    name: string;
    email: string;
  };
}

export const createItem = async (
  ownerId: string,
  data: CreateItemDTO,
): Promise<ItemWithOwner> => {
  const item = await prisma.item.create({
    data: {
      title: data.title,
      description: data.description,
      lat: data.lat,
      lng: data.lng,
      ownerId,
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return item;
};

export const listItems = async (): Promise<ItemWithOwner[]> => {
  const items = await prisma.item.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return items;
};
