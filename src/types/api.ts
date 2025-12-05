// src/types/api.ts
/**
 * API Type Definitions
 * Interview: Why separate type files?
 * Answer: Reusability, maintainability, single source of truth
 */

// src/types/api.ts

/**
 * API Type Definitions for DummyJSON
 * Docs: products, users, auth endpoints [web:2][web:11][web:12]
 */

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string; // from /auth/login response [web:11]
  refreshToken: string; 
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
