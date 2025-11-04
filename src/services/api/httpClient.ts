import type { ApiResponse } from '@/types/api';

export class ApiError extends Error {
  status: number;
  code: string | null;
  details?: unknown;

  constructor(message: string, status: number, code: string | null, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const defaultHeaders: HeadersInit = {
  'Content-Type': 'application/json',
};

export async function http<T>(input: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      ...defaultHeaders,
      ...(init.headers ?? {}),
    },
    credentials: 'include',
  });

  const payload = (await response.json().catch(() => ({}))) as Partial<ApiResponse<T>>;

  if (!response.ok || payload.success === false) {
    const errorMessage = payload?.error?.message ?? response.statusText ?? 'Request failed';
    const errorCode = payload?.error?.code ?? null;
    const errorDetails = payload?.data;
    throw new ApiError(errorMessage, response.status, errorCode, errorDetails);
  }

  if (!payload || typeof payload !== 'object' || !('data' in payload)) {
    throw new ApiError('Unexpected API response', response.status, null, payload);
  }

  return payload.data as T;
}
