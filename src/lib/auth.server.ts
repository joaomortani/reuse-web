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

export const getTokensFromCookies = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value ?? null;

  return { accessToken, refreshToken };
};

export const clearTokens = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { accessToken } = await getTokensFromCookies();

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
        await clearTokens();
        return null;
      }

      // Para outros erros, apenas retornar null sem logar
      // pois isso pode ser um problema temporário de rede
      return null;
    }

    const payload = (await response.json()) as BackendResponse<User>;

    if (!payload.success) {
      return null;
    }

    return payload.data;
  } catch (error) {
    // Não logar erros aqui - são casos esperados:
    // - Usuário não autenticado (sem token ou token inválido)
    // - Problemas temporários de rede
    // - Backend indisponível temporariamente
    // Apenas retornar null silenciosamente
    return null;
  }
};
