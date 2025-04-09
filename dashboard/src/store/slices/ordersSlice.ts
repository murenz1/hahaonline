import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  billingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface OrdersState {
  orders: Order[];
  selectedOrder: Order | null;
  filters: {
    status: string[];
    dateRange: {
      start: string | null;
      end: string | null;
    };
    search: string;
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

const initialState: OrdersState = {
  orders: [],
  selectedOrder: null,
  filters: {
    status: [],
    dateRange: {
      start: null,
      end: null,
    },
    search: '',
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

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    setSelectedOrder: (state, action: PayloadAction<Order | null>) => {
      state.selectedOrder = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<OrdersState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action: PayloadAction<Partial<OrdersState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setSort: (state, action: PayloadAction<OrdersState['sort']>) => {
      state.sort = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateOrderStatus: (state, action: PayloadAction<{ orderId: string; status: Order['status'] }>) => {
      const order = state.orders.find(o => o.id === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
        order.updatedAt = new Date().toISOString();
      }
    },
    updatePaymentStatus: (state, action: PayloadAction<{ orderId: string; status: Order['paymentStatus'] }>) => {
      const order = state.orders.find(o => o.id === action.payload.orderId);
      if (order) {
        order.paymentStatus = action.payload.status;
        order.updatedAt = new Date().toISOString();
      }
    },
  },
});

export const {
  setOrders,
  setSelectedOrder,
  setFilters,
  setPagination,
  setSort,
  setLoading,
  setError,
  updateOrderStatus,
  updatePaymentStatus,
} = ordersSlice.actions;

export default ordersSlice.reducer; 