'use client';

import { useEffect, useState } from 'react';

import type { Category } from '@/types/api';
import { fetchCategories } from '@/services/api/categories';
import { ApiError } from '@/services/api/httpClient';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await fetchCategories();
        setCategories(response);
        setError(null);
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'Não foi possível carregar as categorias';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { categories, loading, error };
};
