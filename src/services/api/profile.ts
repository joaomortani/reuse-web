import type { UpdateProfileInput, User } from '@/types/api';

import { http } from './httpClient';

export const updateProfile = (payload: UpdateProfileInput) =>
  http<User>('/api/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
