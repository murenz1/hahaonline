import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from './store';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    prepareHeaders: (headers, { getState }) => {
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
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    verifyToken: builder.query({
      query: () => '/auth/verify',
    }),
  }),
});

// Dashboard endpoints
export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => '/dashboard/stats',
      providesTags: ['Dashboard'],
    }),
    getRevenueChart: builder.query({
      query: (period) => `/dashboard/revenue?period=${period}`,
      providesTags: ['Dashboard'],
    }),
    getTopProducts: builder.query({
      query: () => '/dashboard/top-products',
      providesTags: ['Dashboard'],
    }),
    getRecentOrders: builder.query({
      query: () => '/dashboard/recent-orders',
      providesTags: ['Dashboard', 'Orders'],
    }),
    getTrafficSources: builder.query({
      query: () => '/dashboard/traffic-sources',
      providesTags: ['Dashboard'],
    }),
  }),
});

// Orders endpoints
export const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: (params) => ({
        url: '/orders',
        params,
      }),
      providesTags: ['Orders'],
    }),
    getOrderById: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Orders', id }],
    }),
    createOrder: builder.mutation({
      query: (order) => ({
        url: '/orders',
        method: 'POST',
        body: order,
      }),
      invalidatesTags: ['Orders'],
    }),
    updateOrder: builder.mutation({
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
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Orders'],
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