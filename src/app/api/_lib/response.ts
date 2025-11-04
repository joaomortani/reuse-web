import { NextResponse } from 'next/server';

import type { ApiErrorShape } from '@/types/api';

export const success = <T>(data: T, init?: ResponseInit) =>
  NextResponse.json(
    {
      success: true,
      data,
      error: { code: null, message: null },
    },
    init,
  );

export const failure = (status: number, error: ApiErrorShape, data?: unknown) =>
  NextResponse.json(
    {
      success: false,
      data: data ?? null,
      error,
    },
    { status },
  );
