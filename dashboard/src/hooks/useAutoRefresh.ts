import { useEffect, useRef } from 'react';
import { getDashboardSettings } from '../utils/dashboardSettings';

interface UseAutoRefreshProps {
  onRefresh: () => void;
  enabled?: boolean;
  interval?: number;
}

export const useAutoRefresh = ({
  onRefresh,
  enabled = false,
  interval = 5,
}: UseAutoRefreshProps): void => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const settings = getDashboardSettings();

  useEffect(() => {
    const isAutoRefreshEnabled = enabled || settings.autoRefresh;
    const refreshInterval = interval || settings.refreshInterval;

    if (isAutoRefreshEnabled) {
      // Initial refresh
      onRefresh();

      // Set up interval
      timerRef.current = setInterval(() => {
        onRefresh();
      }, refreshInterval * 60 * 1000); // Convert minutes to milliseconds

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [enabled, interval, onRefresh, settings.autoRefresh, settings.refreshInterval]);

  // Clear interval when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
}; 