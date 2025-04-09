import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DashboardStats {
  totalSales: {
    today: number;
    week: number;
    month: number;
    year: number;
  };
  orders: {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
  };
  customers: {
    total: number;
    new: number;
    active: number;
  };
  vendors: {
    total: number;
    active: number;
    pending: number;
  };
  inventory: {
    lowStock: number;
    outOfStock: number;
    total: number;
  };
}

interface RevenueData {
  date: string;
  amount: number;
}

interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  stock: number;
}

interface TrafficSource {
  source: string;
  visits: number;
  percentage: number;
}

interface DashboardState {
  stats: DashboardStats | null;
  revenueData: RevenueData[];
  topProducts: TopProduct[];
  trafficSources: TrafficSource[];
  selectedPeriod: 'today' | 'week' | 'month' | 'year';
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  revenueData: [],
  topProducts: [],
  trafficSources: [],
  selectedPeriod: 'week',
  isLoading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setStats: (state, action: PayloadAction<DashboardStats>) => {
      state.stats = action.payload;
    },
    setRevenueData: (state, action: PayloadAction<RevenueData[]>) => {
      state.revenueData = action.payload;
    },
    setTopProducts: (state, action: PayloadAction<TopProduct[]>) => {
      state.topProducts = action.payload;
    },
    setTrafficSources: (state, action: PayloadAction<TrafficSource[]>) => {
      state.trafficSources = action.payload;
    },
    setSelectedPeriod: (
      state,
      action: PayloadAction<'today' | 'week' | 'month' | 'year'>
    ) => {
      state.selectedPeriod = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setStats,
  setRevenueData,
  setTopProducts,
  setTrafficSources,
  setSelectedPeriod,
  setLoading,
  setError,
} = dashboardSlice.actions;

export default dashboardSlice.reducer; 