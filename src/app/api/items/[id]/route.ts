import type { NextRequest } from 'next/server';

import type { CreateItemInput, Item } from '@/types/api';

import { callBackend } from '../../_lib/backend';
import { failure, success } from '../../_lib/response';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const result = await callBackend<Item>(`/items/${id}`);

  if (!result.body.success) {
    return failure(result.status, result.body.error, result.body.data);
  }

  return success(result.body.data);
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const payload = (await request.json()) as CreateItemInput;

  const result = await callBackend<Item>(
    `/items/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
    { requireAuth: true },
  );

  if (!result.body.success) {
    return failure(result.status, result.body.error, result.body.data);
  }

  return success(result.body.data);
}
