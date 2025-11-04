import type { CreateItemInput, Item, ItemFilters, PaginatedResponse } from '@/types/api';

import { http } from './httpClient';

const buildQueryString = (filters?: ItemFilters) => {
  if (!filters) {
    return '';
  }

  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });

  const qs = params.toString();
  return qs ? `?${qs}` : '';
};

export const fetchItems = (filters?: ItemFilters) =>
  http<PaginatedResponse<Item>>(`/api/items${buildQueryString(filters)}`);

export const fetchTopItems = (limit = 6) => http<Item[]>(`/api/items/top?limit=${limit}`);

export const fetchItem = (id: string) => http<Item>(`/api/items/${id}`);

export const createItem = (payload: CreateItemInput) =>
  http<Item>('/api/items', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const updateItem = (id: string, payload: CreateItemInput) =>
  http<Item>(`/api/items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const fetchMyItems = () => http<Item[]>('/api/items/mine');
