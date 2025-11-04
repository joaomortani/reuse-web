import type { Item } from '@/types/api';

import { callBackend } from '../../_lib/backend';
import { failure, success } from '../../_lib/response';

export async function GET() {
  const result = await callBackend<Item[]>('/items/mine', {}, { requireAuth: true });

  if (!result.body.success) {
    return failure(result.status, result.body.error, result.body.data);
  }

  return success(result.body.data);
}
