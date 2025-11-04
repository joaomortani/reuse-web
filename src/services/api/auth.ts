import type { LoginPayload, SignupPayload, User } from '@/types/api';

import { http } from './httpClient';

export const login = (payload: LoginPayload) =>
  http<User>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const signup = (payload: SignupPayload) =>
  http<User>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const logout = () =>
  http<{ success: true }>('/api/auth/logout', {
    method: 'POST',
  });

export const fetchCurrentUser = () => http<User>('/api/auth/me');
