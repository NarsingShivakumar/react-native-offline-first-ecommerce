// src/utils/constants.ts

/**
 * Global application constants
 * Includes API config, storage keys, pagination, cache durations, deep link config
 */

export const API_CONFIG = {
  BASE_URL: 'https://dummyjson.com', // DummyJSON base URL [web:1][web:4]
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@auth_token',
  USER_DATA: '@user_data',
  BIOMETRIC_ENABLED: '@biometric_enabled',
  OFFLINE_QUEUE: '@offline_queue',
  API_CACHE_PREFIX: '@api_cache_',
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 30,
  MAX_PAGE_SIZE: 100,
};

export const CACHE_DURATION = {
  PRODUCTS: 5 * 60 * 1000, // 5 minutes
  USER: 30 * 60 * 1000,    // 30 minutes
};

export const DEEP_LINK_CONFIG = {
  SCHEME: 'shopmasterpro',
  HOST: 'shopmasterpro.com',
};
