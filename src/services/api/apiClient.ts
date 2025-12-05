import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { API_CONFIG, STORAGE_KEYS } from '../../utils/constants';

/**
 * API Client with Offline Support
 * Features:
 * - Request/Response interceptors
 * - Automatic retry with exponential backoff
 * - Caching for GET requests
 * - Offline queue management
 */

interface QueuedRequest {
  config: AxiosRequestConfig;
  timestamp: number;
}

class APIClient {
  private instance: AxiosInstance;
  private offlineQueue: QueuedRequest[] = [];


  constructor() {
    this.instance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    this.loadOfflineQueue();
    this.setupNetworkListener();
  }

  private setupInterceptors() {
    // Request Interceptor
    this.instance.interceptors.request.use(
      async config => {
        // Add auth token
        const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Check network connectivity
        const netInfo = await NetInfo.fetch();
        if (!netInfo.isConnected) {
          // Queue non-GET requests
          if (config.method !== 'get') {
            await this.queueRequest(config);
          }
          throw new Error('No internet connection');
        }

        return config;
      },
      error => Promise.reject(error)
    );

    // Response Interceptor
    this.instance.interceptors.response.use(
      async response => {
        // Cache GET responses
        if (response.config.method === 'get' && response.config.url) {
          await this.cacheResponse(response.config.url, response.data);
        }
        return response;
      },
      async (error: AxiosError) => {
        const config = error.config as AxiosRequestConfig & { retry?: number };

        // Return cached data if available
        if (error.message === 'No internet connection' && config.method === 'get') {
          const cachedData = await this.getCachedResponse(config.url!);
          if (cachedData) {
            return {
              ...config,
              data: cachedData,
              fromCache: true,
              status: 200,
            };
          }
        }

        // Retry logic with exponential backoff
        if (!config || !config.retry) {
          config.retry = 0;
        }

        config.retry += 1;
        const delayMs = config.retry * API_CONFIG.RETRY_DELAY;


        if (config.retry <= API_CONFIG.RETRY_ATTEMPTS) {
          const delay = config.retry * API_CONFIG.RETRY_DELAY;
          await new Promise<void>(resolve =>
            setTimeout(() => resolve(), delayMs)
          );          
            return this.instance(config);
        }

        return Promise.reject(error);
      }
    );
  }

  private async cacheResponse(url: string, data: any) {
    try {
      const cacheKey = STORAGE_KEYS.API_CACHE_PREFIX + url;
      await AsyncStorage.setItem(
        cacheKey,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error('Cache error:', error);
    }
  }

  private async getCachedResponse(url: string) {
    try {
      const cacheKey = STORAGE_KEYS.API_CACHE_PREFIX + url;
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        // Cache valid for 5 minutes
        if (Date.now() - timestamp < 5 * 60 * 1000) {
          return data;
        }
      }
    } catch (error) {
      console.error('Cache retrieval error:', error);
    }
    return null;
  }

  private async queueRequest(config: AxiosRequestConfig) {
    this.offlineQueue.push({
      config,
      timestamp: Date.now(),
    });
    await AsyncStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(this.offlineQueue));
  }

  private async loadOfflineQueue() {
    try {
      const queue = await AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
      if (queue) {
        this.offlineQueue = JSON.parse(queue);
      }
    } catch (error) {
      console.error('Load queue error:', error);
    }
  }

  private setupNetworkListener() {
    NetInfo.addEventListener(state => {
      if (state.isConnected) {
        this.processOfflineQueue();
      }
    });
  }

  private async processOfflineQueue() {
    if (this.offlineQueue.length === 0) return;

    const queue = [...this.offlineQueue];
    this.offlineQueue = [];
    await AsyncStorage.removeItem(STORAGE_KEYS.OFFLINE_QUEUE);

    for (const item of queue) {
      try {
        await this.instance(item.config);
      } catch (error) {
        console.error('Queue processing error:', error);
        // Re-queue if still failing
        await this.queueRequest(item.config);
      }
    }
  }

  public get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(url, config);
  }

  public post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(url, data, config);
  }

  public put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.put<T>(url, data, config);
  }

  public delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(url, config);
  }

  public patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.patch<T>(url, data, config);
  }
}

export default new APIClient();
