// productsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { productsApi } from '../../services/api/productsApi';
import { Product, ProductsResponse } from '../../types/api';

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
  activeCategory: string | null;
  pagination: {
    total: number;
    skip: number;
    limit: number;
  };
  lastFetched: number | null;
  offlineQueue: Array<{ action: string; payload: any }>;
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
  activeCategory: null,
  pagination: {
    total: 0,
    skip: 0,
    limit: 30,
  },
  lastFetched: null,
  offlineQueue: [],
};

// Async Thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (
    { limit = 30, skip = 0 }: { limit?: number; skip?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await productsApi.getAll(limit, skip);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await productsApi.getById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await productsApi.search(query);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async (category: string, { rejectWithValue }) => {
    try {
      const response = await productsApi.getByCategory(category);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addToOfflineQueue: (state, action: PayloadAction<{ action: string; payload: any }>) => {
      state.offlineQueue.push(action.payload);
    },
    clearOfflineQueue: state => {
      state.offlineQueue = [];
    },
    resetProducts: state => {
      state.items = [];
      state.pagination.skip = 0;
    },
    appendProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = [...state.items, ...action.payload];
    },
  },
  extraReducers: builder => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.activeCategory = null;

        const skip = action.meta?.arg?.skip ?? 0;

        if (skip === 0) {
          state.items = [];
          state.pagination = {
            ...state.pagination,
            skip: 0,
          };
        }
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.skip === 0) {
          state.items = action.payload.products;
        } else {
          state.items = [...state.items, ...action.payload.products];
        }
        state.pagination = {
          total: action.payload.total,
          skip: action.payload.skip,
          limit: action.payload.limit,
        };
        state.lastFetched = Date.now();
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Single Product
      .addCase(fetchProductById.pending, state => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        const existingIndex = state.items.findIndex(p => p.id === action.payload.id);
        if (existingIndex >= 0) {
          state.items[existingIndex] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Search Products
      .addCase(searchProducts.pending, state => {
        state.loading = true;
        state.items = [];
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.items = action.payload.products;
        state.loading = false;
        state.pagination.total = action.payload.total;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch by Category
      .addCase(fetchProductsByCategory.pending, state => {
        state.loading = true;
        state.error = null;
        state.items = []; // CLEAR OLD DATA instantly
        // activeCategory will be set in fulfilled using action.meta.arg
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.items = action.payload.products;
        state.loading = false;
        state.activeCategory = action.meta.arg; // Now set after data arrives
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addToOfflineQueue, clearOfflineQueue, resetProducts, appendProducts } =
  productsSlice.actions;

export default productsSlice.reducer;
