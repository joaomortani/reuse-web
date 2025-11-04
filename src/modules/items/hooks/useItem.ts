'use client';

import { useCallback, useEffect, useState } from 'react';

import type { Item } from '@/types/api';
import { ApiError } from '@/services/api/httpClient';
import { fetchItem } from '@/services/api/items';

interface ItemState {
  item: Item | null;
  loading: boolean;
  error: string | null;
}

export const useItem = (id: string | null) => {
  const [state, setState] = useState<ItemState>({ item: null, loading: Boolean(id), error: null });

  const loadItem = useCallback(async () => {
    if (!id) {
      return;
    }

    setState((previous) => ({ ...previous, loading: true, error: null }));

    try {
      const result = await fetchItem(id);
      setState({ item: result, loading: false, error: null });
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Não foi possível carregar o item';
      setState({ item: null, loading: false, error: message });
    }
  }, [id]);

  useEffect(() => {
    loadItem();
  }, [loadItem]);

  return { ...state, reload: loadItem };
};
