import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  price: number;
  cost: number;
  stock: number;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  attributes: Record<string, string>;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  variants: ProductVariant[];
  images: string[];
  tags: string[];
  status: 'active' | 'inactive' | 'discontinued';
  createdAt: string;
  updatedAt: string;
  metadata: {
    seoTitle?: string;
    seoDescription?: string;
    features?: string[];
    specifications?: Record<string, string>;
  };
}

interface ProductsState {
  products: Product[];
  selectedProduct: Product | null;
  filters: {
    category: string[];
    brand: string[];
    status: string[];
    search: string;
    minPrice: number | null;
    maxPrice: number | null;
    inStock: boolean | null;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  sort: {
    field: string;
    direction: 'asc' | 'desc';
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  selectedProduct: null,
  filters: {
    category: [],
    brand: [],
    status: [],
    search: '',
    minPrice: null,
    maxPrice: null,
    inStock: null,
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  sort: {
    field: 'name',
    direction: 'asc',
  },
  isLoading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ProductsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to first page when filters change
    },
    setPagination: (state, action: PayloadAction<Partial<ProductsState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setSort: (state, action: PayloadAction<ProductsState['sort']>) => {
      state.sort = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
        if (state.selectedProduct?.id === action.payload.id) {
          state.selectedProduct = action.payload;
        }
      }
    },
    updateProductStatus: (state, action: PayloadAction<{ id: string; status: Product['status'] }>) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index].status = action.payload.status;
        if (state.selectedProduct?.id === action.payload.id) {
          state.selectedProduct.status = action.payload.status;
        }
      }
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.unshift(action.payload);
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(p => p.id !== action.payload);
      if (state.selectedProduct?.id === action.payload) {
        state.selectedProduct = null;
      }
    },
  },
});

export const {
  setProducts,
  setSelectedProduct,
  setFilters,
  setPagination,
  setSort,
  setLoading,
  setError,
  updateProduct,
  updateProductStatus,
  addProduct,
  deleteProduct,
} = productsSlice.actions;

export default productsSlice.reducer; 