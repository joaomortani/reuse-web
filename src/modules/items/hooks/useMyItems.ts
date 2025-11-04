'use client';

import { useEffect, useState } from 'react';

import type { Item } from '@/types/api';
import { ApiError } from '@/services/api/httpClient';
import { fetchMyItems } from '@/services/api/items';

export const useMyItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchMyItems();
        setItems(data);
        setError(null);
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'Não foi possível carregar seus itens';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { items, loading, error };
};
