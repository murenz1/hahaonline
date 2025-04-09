import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../utils/cn';
import { DashboardActions } from './DashboardActions';
import { QuickStats } from './QuickStats';
import { RevenueChart } from './RevenueChart';
import { TopProducts } from './TopProducts';
import { RecentActivity } from './RecentActivity';
import { UpcomingTasks } from './UpcomingTasks';
import { Sidebar } from './Sidebar';
import { useGetDashboardStatsQuery } from '../store/api';

export const DashboardLayout: React.FC = () => {
  const { theme } = useTheme();
  const { data: stats, isLoading } = useGetDashboardStatsQuery();

  return (
    <div className={cn(
      "min-h-screen flex transition-colors duration-200",
      theme === 'dark' ? 'bg-[#0F1117]' : 'bg-gray-50'
    )}>
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className={cn(
              "text-2xl font-bold",
              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            )}>
              Dashboard Overview
            </h1>
            <DashboardActions />
          </div>

          {/* Quick Stats */}
          <QuickStats stats={stats} isLoading={isLoading} />

          {/* Charts and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RevenueChart period="week" />
            <TopProducts />
          </div>

          {/* Recent Activity and Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RecentActivity />
            <UpcomingTasks />
          </div>
        </div>
      </main>
    </div>
  );
}; 