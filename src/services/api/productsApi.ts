import apiClient from './apiClient';
import { Product, ProductsResponse } from '../../types/api';

/**
 * Products API Service
 * All product-related API calls
 */

export const productsApi = {
  getAll: async (limit: number = 30, skip: number = 0): Promise<ProductsResponse> => {
    const response = await apiClient.get<ProductsResponse>(
      `/products?limit=${limit}&skip=${skip}`
    );
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  search: async (query: string): Promise<ProductsResponse> => {
    const response = await apiClient.get<ProductsResponse>(`/products/search?q=${query}`);
    return response.data;
  },

  getByCategory: async (category: string): Promise<ProductsResponse> => {
    const response = await apiClient.get<ProductsResponse>(`/products/category/${category}`);
    return response.data;
  },

  getCategories: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>('/products/categories');
    return response.data;
  },
};
