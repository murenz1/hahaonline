interface CacheOptions {
  ttl?: number; // Time to live in minutes
  key: string;
}

interface CachedData<T> {
  data: T;
  timestamp: number;
  ttl?: number;
}

export class DataCache {
  private static instance: DataCache;
  private cache: Map<string, CachedData<any>> = new Map();

  private constructor() {}

  public static getInstance(): DataCache {
    if (!DataCache.instance) {
      DataCache.instance = new DataCache();
    }
    return DataCache.instance;
  }

  public set<T>(key: string, data: T, options?: CacheOptions): void {
    const cachedData: CachedData<T> = {
      data,
      timestamp: Date.now(),
      ttl: options?.ttl,
    };

    this.cache.set(key, cachedData);

    // Also store in localStorage for persistence
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify(cachedData));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  public get<T>(key: string): T | null {
    // Try to get from memory cache first
    const cachedData = this.cache.get(key) as CachedData<T> | undefined;
    if (cachedData) {
      if (this.isValid(cachedData)) {
        return cachedData.data;
      }
      this.cache.delete(key);
    }

    // Try to get from localStorage
    try {
      const storedData = localStorage.getItem(`cache_${key}`);
      if (storedData) {
        const parsedData: CachedData<T> = JSON.parse(storedData);
        if (this.isValid(parsedData)) {
          // Update memory cache
          this.cache.set(key, parsedData);
          return parsedData.data;
        }
        localStorage.removeItem(`cache_${key}`);
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }

    return null;
  }

  public delete(key: string): void {
    this.cache.delete(key);
    try {
      localStorage.removeItem(`cache_${key}`);
    } catch (error) {
      console.error('Error deleting from localStorage:', error);
    }
  }

  public clear(): void {
    this.cache.clear();
    try {
      // Clear only cache-related items from localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cache_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing localStorage cache:', error);
    }
  }

  private isValid(cachedData: CachedData<any>): boolean {
    if (!cachedData.ttl) return true;
    const now = Date.now();
    return now - cachedData.timestamp < cachedData.ttl * 60 * 1000;
  }
}

export const dataCache = DataCache.getInstance(); 