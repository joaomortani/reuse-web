import type { NextRequest } from 'next/server';

import type { LoginResponse, User } from '@/types/api';

import { callBackend, clearAuthCookies, setAuthCookies } from '../../_lib/backend';
import { failure, success } from '../../_lib/response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const registerResult = await callBackend<User>(
      '/users/register',
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      { requireAuth: false },
    );

    if (!registerResult.body.success) {
      return failure(registerResult.status, registerResult.body.error, registerResult.body.data);
    }

    const loginResult = await callBackend<LoginResponse>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email: body.email, password: body.password }),
      },
      { requireAuth: false },
    );

    if (!loginResult.body.success) {
      await clearAuthCookies();
      return failure(loginResult.status, loginResult.body.error, loginResult.body.data);
    }

    const { user, accessToken, refreshToken } = loginResult.body.data;

    await setAuthCookies(accessToken, refreshToken);

    return success(user);
  } catch (error) {
    console.error('Signup error', error);
    return failure(500, { code: 'SIGNUP_ERROR', message: 'Unable to sign up' });
  }
}
