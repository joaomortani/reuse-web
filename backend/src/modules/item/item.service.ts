import { ItemCondition, type Prisma } from '@prisma/client';

import prisma from '../../lib/prisma';
import type { CreateItemDTO } from './item.dto';

export interface ItemWithOwner {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: ItemCondition;
  images: string[];
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
      category: data.category,
      condition: data.condition,
      images: data.images ?? [],
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

export interface ListItemsFilters {
  page: number;
  limit: number;
  category?: string;
  ownerId?: string;
  search?: string;
}

export interface PaginatedItems {
  items: ItemWithOwner[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const buildItemWhere = (filters: Omit<ListItemsFilters, 'page' | 'limit'>): Prisma.ItemWhereInput => {
  const where: Prisma.ItemWhereInput = {};

  if (filters.category) {
    where.category = filters.category;
  }

  if (filters.ownerId) {
    where.ownerId = filters.ownerId;
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  return where;
};

export const listItems = async (filters: ListItemsFilters): Promise<PaginatedItems> => {
  const { page, limit, ...whereFilters } = filters;
  const where = buildItemWhere(whereFilters);
  const skip = (page - 1) * limit;

  const [items, total] = await prisma.$transaction([
    prisma.item.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.item.count({ where }),
  ]);

  const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;

  return {
    items,
    total,
    page,
    limit,
    totalPages,
  };
};

export interface NearbyItemsFilters {
  lat: number;
  lng: number;
  radius: number;
  category?: string;
}

const haversineDistanceKm = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const toRadians = (value: number) => (value * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const earthRadiusKm = 6371;

  return earthRadiusKm * c;
};

export const listNearbyItems = async (filters: NearbyItemsFilters): Promise<ItemWithOwner[]> => {
  const { lat, lng, radius, category } = filters;

  const latRadius = radius / 111.32; // Approximate km per degree latitude
  const lngRadius = radius / (111.32 * Math.cos((lat * Math.PI) / 180));
  const adjustedLngRadius = Number.isFinite(lngRadius) && lngRadius > 0 ? lngRadius : latRadius;

  const where: Prisma.ItemWhereInput = {
    lat: { gte: lat - latRadius, lte: lat + latRadius },
    lng: { gte: lng - adjustedLngRadius, lte: lng + adjustedLngRadius },
  };

  if (category) {
    where.category = category;
  }

  const items = await prisma.item.findMany({
    where,
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

  return items.filter((item) => haversineDistanceKm(lat, lng, item.lat, item.lng) <= radius);
};

export const listTopItems = async (limit: number): Promise<ItemWithOwner[]> => {
  const items = await prisma.item.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
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
