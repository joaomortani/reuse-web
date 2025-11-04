import { cookies } from 'next/headers';

import { REFRESH_TOKEN_COOKIE } from '@/lib/auth.server';

import { clearAuthCookies, callBackend } from '../../_lib/backend';
import { failure, success } from '../../_lib/response';

export async function POST() {
  try {
    const refreshToken = cookies().get(REFRESH_TOKEN_COOKIE)?.value;

    if (refreshToken) {
      await callBackend<unknown>(
        '/auth/logout',
        {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        },
        { requireAuth: false },
      );
    }

    clearAuthCookies();

    return success({ success: true });
  } catch (error) {
    console.error('Logout error', error);
    clearAuthCookies();
    return failure(500, { code: 'LOGOUT_ERROR', message: 'Unable to logout' });
  }
}
