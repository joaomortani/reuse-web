export const getBackendBaseUrl = (): string => {
  const url = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!url) {
    throw new Error('BACKEND_API_URL is not configured');
  }

  return url.replace(/\/$/, '');
};

export const isProduction = () => process.env.NODE_ENV === 'production';
