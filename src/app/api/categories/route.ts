import type { Category } from '@/types/api';

import { callBackend } from '../_lib/backend';
import { failure, success } from '../_lib/response';

export async function GET() {
  const result = await callBackend<Category[]>('/categories');

  if (!result.body.success) {
    return failure(result.status, result.body.error, result.body.data);
  }

  return success(result.body.data);
}
