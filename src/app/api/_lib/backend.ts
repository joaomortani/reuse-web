import { cookies } from 'next/headers';

import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '@/lib/auth.server';
import { getBackendBaseUrl, isProduction } from '@/lib/env';
import type { ApiErrorShape } from '@/types/api';

interface BackendResponse<T> {
  success: boolean;
  data: T;
  error: ApiErrorShape;
}

const baseUrl = () => getBackendBaseUrl();

export const setAuthCookies = (accessToken: string, refreshToken: string) => {
  const cookieStore = cookies();

  const commonOptions = {
    httpOnly: true,
    secure: isProduction(),
    sameSite: 'lax' as const,
    path: '/',
  };

  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
    ...commonOptions,
    maxAge: 60 * 15,
  });

  cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    ...commonOptions,
    maxAge: 60 * 60 * 24 * 30,
  });
};

export const clearAuthCookies = () => {
  const cookieStore = cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
};

export interface BackendCallResult<T> {
  status: number;
  body: BackendResponse<T>;
}

export const callBackend = async <T>(
  path: string,
  init: RequestInit = {},
  { requireAuth = false }: { requireAuth?: boolean } = {},
): Promise<BackendCallResult<T>> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init.headers ?? {}),
  };

  if (requireAuth) {
    const token = cookies().get(ACCESS_TOKEN_COOKIE)?.value;

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(`${baseUrl()}${path}`, {
      ...init,
      headers,
      cache: 'no-store',
    });

    const payload = (await response.json().catch(() => ({}))) as BackendResponse<T> | undefined;

    if (!payload) {
      return {
        status: response.status,
        body: {
          success: false,
          data: null as T,
          error: { code: null, message: 'Invalid backend response' },
        },
      };
    }

    return {
      status: response.status,
      body: payload,
    };
  } catch (error) {
    console.error('Backend request failed', error);
    return {
      status: 500,
      body: {
        success: false,
        data: null as T,
        error: { code: 'BACKEND_UNAVAILABLE', message: 'Backend service unavailable' },
      },
    };
  }
};
