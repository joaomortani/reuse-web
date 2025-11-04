import type { NextRequest } from 'next/server';

import type { CreateItemInput, Item, PaginatedResponse } from '@/types/api';

import { callBackend } from '../_lib/backend';
import { failure, success } from '../_lib/response';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.toString();
  const path = `/items${query ? `?${query}` : ''}`;

  const result = await callBackend<PaginatedResponse<Item>>(path);

  if (!result.body.success) {
    return failure(result.status, result.body.error, result.body.data);
  }

  return success(result.body.data);
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as CreateItemInput;

  const result = await callBackend<Item>(
    '/items',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    { requireAuth: true },
  );

  if (!result.body.success) {
    return failure(result.status, result.body.error, result.body.data);
  }

  return success(result.body.data, { status: 201 });
}
