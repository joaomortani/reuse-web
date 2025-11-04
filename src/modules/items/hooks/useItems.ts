'use client';

import { useCallback, useEffect, useState } from 'react';

import type { Item, ItemFilters, PaginatedResponse } from '@/types/api';
import { ApiError } from '@/services/api/httpClient';
import { fetchItems } from '@/services/api/items';

interface ItemsState {
  data: PaginatedResponse<Item> | null;
  loading: boolean;
  error: string | null;
}

export const useItems = (filters?: ItemFilters) => {
  const [state, setState] = useState<ItemsState>({ data: null, loading: true, error: null });
  const loadItems = useCallback(async () => {
    setState((previous) => ({ ...previous, loading: true, error: null }));

    try {
      const response = await fetchItems(filters);
      setState({ data: response, loading: false, error: null });
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Não foi possível carregar os itens';
      setState({ data: null, loading: false, error: message });
    }
  }, [filters]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  return {
    items: state.data?.items ?? [],
    pagination: state.data,
    loading: state.loading,
    error: state.error,
    reload: loadItems,
  };
};
