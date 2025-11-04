import type { NextRequest } from 'next/server';

import type { Item } from '@/types/api';

import { callBackend } from '../../_lib/backend';
import { failure, success } from '../../_lib/response';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.toString();
  const path = `/items/top${limit ? `?${limit}` : ''}`;

  const result = await callBackend<Item[]>(path);

  if (!result.body.success) {
    return failure(result.status, result.body.error, result.body.data);
  }

  return success(result.body.data);
}
