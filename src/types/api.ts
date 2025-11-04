export interface ApiErrorShape {
  code: string | null;
  message: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: ApiErrorShape;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string | null;
  avatarUrl?: string | null;
  createdAt?: string;
}

export type ItemCondition = 'NEW' | 'USED' | 'GOOD' | 'FAIR';

export interface Category {
  id: string;
  name: string;
}

export interface ItemOwner {
  id: string;
  name: string;
  email: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  condition: ItemCondition;
  images: string[];
  lat: number;
  lng: number;
  ownerId: string;
  createdAt: string;
  categoryId?: string | null;
  category?: Category | null;
  owner: ItemOwner;
}

export interface CreateItemInput {
  title: string;
  description: string;
  condition: ItemCondition;
  images?: string[];
  lat: number;
  lng: number;
  categoryId?: string | null;
}

export interface UpdateProfileInput {
  name?: string;
  bio?: string | null;
  avatarUrl?: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ItemFilters {
  search?: string;
  category?: string;
  ownerId?: string;
  page?: number;
  limit?: number;
}
