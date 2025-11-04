import type { Category } from '@/types/api';

import { http } from './httpClient';

export const fetchCategories = () => http<Category[]>('/api/categories');
