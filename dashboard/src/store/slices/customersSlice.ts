import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CustomerAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  status: 'active' | 'inactive' | 'blocked';
  addresses: CustomerAddress[];
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
  marketingPreferences: {
    email: boolean;
    sms: boolean;
    phone: boolean;
  };
  tags: string[];
}

interface CustomersState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  filters: {
    status: string[];
    search: string;
    tags: string[];
    dateRange: {
      start: string | null;
      end: string | null;
    };
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

const initialState: CustomersState = {
  customers: [],
  selectedCustomer: null,
  filters: {
    status: [],
    search: '',
    tags: [],
    dateRange: {
      start: null,
      end: null,
    },
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  sort: {
    field: 'createdAt',
    direction: 'desc',
  },
  isLoading: false,
  error: null,
};

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setCustomers: (state, action: PayloadAction<Customer[]>) => {
      state.customers = action.payload;
    },
    setSelectedCustomer: (state, action: PayloadAction<Customer | null>) => {
      state.selectedCustomer = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<CustomersState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action: PayloadAction<Partial<CustomersState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setSort: (state, action: PayloadAction<CustomersState['sort']>) => {
      state.sort = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateCustomerStatus: (state, action: PayloadAction<{ customerId: string; status: Customer['status'] }>) => {
      const customer = state.customers.find(c => c.id === action.payload.customerId);
      if (customer) {
        customer.status = action.payload.status;
        customer.updatedAt = new Date().toISOString();
      }
    },
    updateCustomerTags: (state, action: PayloadAction<{ customerId: string; tags: string[] }>) => {
      const customer = state.customers.find(c => c.id === action.payload.customerId);
      if (customer) {
        customer.tags = action.payload.tags;
        customer.updatedAt = new Date().toISOString();
      }
    },
    updateMarketingPreferences: (
      state,
      action: PayloadAction<{
        customerId: string;
        preferences: Customer['marketingPreferences'];
      }>
    ) => {
      const customer = state.customers.find(c => c.id === action.payload.customerId);
      if (customer) {
        customer.marketingPreferences = action.payload.preferences;
        customer.updatedAt = new Date().toISOString();
      }
    },
  },
});

export const {
  setCustomers,
  setSelectedCustomer,
  setFilters,
  setPagination,
  setSort,
  setLoading,
  setError,
  updateCustomerStatus,
  updateCustomerTags,
  updateMarketingPreferences,
} = customersSlice.actions;

export default customersSlice.reducer; 