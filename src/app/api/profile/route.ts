import type { NextRequest } from 'next/server';

import type { UpdateProfileInput, User } from '@/types/api';

import { callBackend } from '../_lib/backend';
import { failure, success } from '../_lib/response';

export async function PUT(request: NextRequest) {
  const body = (await request.json()) as UpdateProfileInput;

  const result = await callBackend<User>(
    '/users/me',
    {
      method: 'PUT',
      body: JSON.stringify(body),
    },
    { requireAuth: true },
  );

  if (!result.body.success) {
    return failure(result.status, result.body.error, result.body.data);
  }

  return success(result.body.data);
}
