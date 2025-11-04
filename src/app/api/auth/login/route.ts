import type { NextRequest } from 'next/server';

import type { LoginResponse } from '@/types/api';

import { callBackend, clearAuthCookies, setAuthCookies } from '../../_lib/backend';
import { failure, success } from '../../_lib/response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await callBackend<LoginResponse>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      { requireAuth: false },
    );

    if (!result.body.success) {
      await clearAuthCookies();
      return failure(result.status, result.body.error, result.body.data);
    }

    const { user, accessToken, refreshToken } = result.body.data;

    await setAuthCookies(accessToken, refreshToken);

    return success(user);
  } catch (error) {
    console.error('Login error', error);
    return failure(500, { code: 'LOGIN_ERROR', message: 'Unable to authenticate with backend' });
  }
}
