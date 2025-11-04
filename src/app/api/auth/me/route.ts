import { cookies } from 'next/headers';

import { ACCESS_TOKEN_COOKIE } from '@/lib/auth.server';
import type { User } from '@/types/api';

import { callBackend } from '../../_lib/backend';
import { failure, success } from '../../_lib/response';

export async function GET() {
  const token = cookies().get(ACCESS_TOKEN_COOKIE)?.value;

  if (!token) {
    return failure(401, { code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }

  const result = await callBackend<User>('/auth/me', {}, { requireAuth: true });

  if (!result.body.success) {
    return failure(result.status, result.body.error, result.body.data);
  }

  return success(result.body.data);
}
