import { cookies } from 'next/headers';

import type { User } from '@/types/api';
import { getBackendBaseUrl } from './env';

export const ACCESS_TOKEN_COOKIE = 'reuse_access_token';
export const REFRESH_TOKEN_COOKIE = 'reuse_refresh_token';

interface BackendResponse<T> {
  success: boolean;
  data: T;
  error: { code: string | null; message: string | null };
}

export const getTokensFromCookies = () => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value ?? null;

  return { accessToken, refreshToken };
};

export const clearTokens = () => {
  const cookieStore = cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { accessToken } = getTokensFromCookies();

  if (!accessToken) {
    return null;
  }

  const baseUrl = getBackendBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 401) {
        clearTokens();
        return null;
      }

      throw new Error('Failed to fetch current user');
    }

    const payload = (await response.json()) as BackendResponse<User>;

    if (!payload.success) {
      return null;
    }

    return payload.data;
  } catch (error) {
    console.error('Error fetching current user', error);
    return null;
  }
};
