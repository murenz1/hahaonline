import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from './store';
import { Customer } from './slices/customersSlice';

type LoginCredentials = {
  email: string;
  password: string;
};

type UserData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

type OrderParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

type CustomerParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  tags?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

type OrderData = {
  id?: string;
  customerId: string;
  products: Array<{
    id: string;
    quantity: number;
    price: number;
  }>;
  status: string;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
};

type CustomerUpdateData = Partial<Omit<Customer, 'id'>>;

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    prepareHeaders: (headers: Headers, { getState }: { getState: () => unknown }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    'Dashboard',
    'Orders',
    'Customers',
    'Vendors',
    'Products',
    'Payments',
    'Shipping',
    'Analytics',
    'Marketing',
    'Settings',
    'Support',
  ],
  endpoints: () => ({}),
});

// Auth endpoints
export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ token: string; user: unknown }, LoginCredentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<{ token: string; user: unknown }, UserData>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    verifyToken: builder.query<{ valid: boolean; user?: unknown }, void>({
      query: () => '/auth/verify',
    }),
  }),
});

// Dashboard endpoints
export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<any, void>({
      query: () => '/dashboard/stats',
      providesTags: ['Dashboard'],
    }),
    getRevenueChart: builder.query<any, string>({
      query: (period) => `/dashboard/revenue?period=${period}`,
      providesTags: ['Dashboard'],
    }),
    getTopProducts: builder.query<any, void>({
      query: () => '/dashboard/top-products',
      providesTags: ['Dashboard'],
    }),
    getRecentOrders: builder.query<any, void>({
      query: () => '/dashboard/recent-orders',
      providesTags: ['Dashboard', 'Orders'],
    }),
    getTrafficSources: builder.query<any, void>({
      query: () => '/dashboard/traffic-sources',
      providesTags: ['Dashboard'],
    }),
  }),
});

// Orders endpoints
export const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<{ orders: any[]; total: number }, OrderParams>({
      query: (params) => ({
        url: '/orders',
        params,
      }),
      providesTags: ['Orders'],
    }),
    getOrderById: builder.query<any, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Orders', id }],
    }),
    createOrder: builder.mutation<any, OrderData>({
      query: (order) => ({
        url: '/orders',
        method: 'POST',
        body: order,
      }),
      invalidatesTags: ['Orders'],
    }),
    updateOrder: builder.mutation<any, { id: string } & Partial<OrderData>>({
      query: ({ id, ...update }) => ({
        url: `/orders/${id}`,
        method: 'PUT',
        body: update,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Orders', id },
        'Orders',
      ],
    }),
    deleteOrder: builder.mutation<any, string>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Orders'],
    }),
  }),
});

// Customers endpoints
export const customersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<{ customers: Customer[]; total: number }, CustomerParams>({
      query: (params) => ({
        url: '/customers',
        params,
      }),
      providesTags: ['Customers'],
    }),
    getCustomerById: builder.query<Customer, string>({
      query: (id) => `/customers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Customers', id }],
    }),
    createCustomer: builder.mutation<Customer, Omit<Customer, 'id'>>({
      query: (customer) => ({
        url: '/customers',
        method: 'POST',
        body: customer,
      }),
      invalidatesTags: ['Customers'],
    }),
    updateCustomer: builder.mutation<Customer, { id: string } & CustomerUpdateData>({
      query: ({ id, ...update }) => ({
        url: `/customers/${id}`,
        method: 'PUT',
        body: update,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Customers', id },
        'Customers',
      ],
    }),
    deleteCustomer: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/customers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Customers'],
    }),
    updateCustomerStatus: builder.mutation<
      Customer,
      { id: string; status: Customer['status'] }
    >({
      query: ({ id, status }) => ({
        url: `/customers/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Customers', id },
        'Customers',
      ],
    }),
    updateCustomerTags: builder.mutation<
      Customer,
      { id: string; tags: string[] }
    >({
      query: ({ id, tags }) => ({
        url: `/customers/${id}/tags`,
        method: 'PATCH',
        body: { tags },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Customers', id },
        'Customers',
      ],
    }),
    updateMarketingPreferences: builder.mutation<
      Customer,
      { id: string; preferences: Customer['marketingPreferences'] }
    >({
      query: ({ id, preferences }) => ({
        url: `/customers/${id}/marketing-preferences`,
        method: 'PATCH',
        body: { preferences },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Customers', id },
        'Customers',
      ],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyTokenQuery,
} = authApi;

export const {
  useGetDashboardStatsQuery,
  useGetRevenueChartQuery,
  useGetTopProductsQuery,
  useGetRecentOrdersQuery,
  useGetTrafficSourcesQuery,
} = dashboardApi;

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = ordersApi;

export const {
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useUpdateCustomerStatusMutation,
  useUpdateCustomerTagsMutation,
  useUpdateMarketingPreferencesMutation,
} = customersApi;