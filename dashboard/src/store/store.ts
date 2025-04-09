import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from './api';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import ordersReducer from './slices/ordersSlice';
import customersReducer from './slices/customersSlice';
import vendorsReducer from './slices/vendorsSlice';
import productsReducer from './slices/productsSlice';
import paymentsReducer from './slices/paymentsSlice';
import shippingReducer from './slices/shippingSlice';
import marketingReducer from './slices/marketingSlice';
import settingsReducer from './slices/settingsSlice';
import supportReducer from './slices/supportSlice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    dashboard: dashboardReducer,
    orders: ordersReducer,435 4334
    customers: customersReducer,
    vendors: vendorsReducer,
    products: productsReducer,
    payments: paymentsReducer,
    shipping: shippingReducer,
    marketing: marketingReducer,
    settings: settingsReducer,
    support: supportReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 