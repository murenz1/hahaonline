interface DashboardSettings {
  notificationsEnabled: boolean;
  viewMode: 'grid' | 'list';
  autoRefresh: boolean;
  refreshInterval: number;
  layout: Record<string, any>;
}

const DEFAULT_SETTINGS: DashboardSettings = {
  notificationsEnabled: true,
  viewMode: 'grid',
  autoRefresh: false,
  refreshInterval: 5,
  layout: {},
};

const STORAGE_KEY = 'dashboard_settings';

export const getDashboardSettings = (): DashboardSettings => {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  
  try {
    const storedSettings = localStorage.getItem(STORAGE_KEY);
    if (!storedSettings) return DEFAULT_SETTINGS;
    
    const parsedSettings = JSON.parse(storedSettings);
    return {
      ...DEFAULT_SETTINGS,
      ...parsedSettings,
    };
  } catch (error) {
    console.error('Error loading dashboard settings:', error);
    return DEFAULT_SETTINGS;
  }
};

export const saveDashboardSettings = (settings: Partial<DashboardSettings>): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const currentSettings = getDashboardSettings();
    const newSettings = {
      ...currentSettings,
      ...settings,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
  } catch (error) {
    console.error('Error saving dashboard settings:', error);
  }
};

export const resetDashboardSettings = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
  } catch (error) {
    console.error('Error resetting dashboard settings:', error);
  }
};

export const getLayout = (): Record<string, any> => {
  const settings = getDashboardSettings();
  return settings.layout;
};

export const saveLayout = (layout: Record<string, any>): void => {
  saveDashboardSettings({ layout });
};

export const resetLayout = (): void => {
  saveDashboardSettings({ layout: DEFAULT_SETTINGS.layout });
}; 