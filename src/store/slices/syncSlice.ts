import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Sync Slice for Offline Queue Management
 */

interface SyncItem {
  id: string;
  action: string;
  payload: any;
  timestamp: number;
  retryCount: number;
}

interface SyncState {
  queue: SyncItem[];
  isSyncing: boolean;
  lastSyncTime: number | null;
  syncErrors: string[];
}

const initialState: SyncState = {
  queue: [],
  isSyncing: false,
  lastSyncTime: null,
  syncErrors: [],
};

const syncSlice = createSlice({
  name: 'sync',
  initialState,
  reducers: {
    addToSyncQueue: (state, action: PayloadAction<Omit<SyncItem, 'id' | 'timestamp' | 'retryCount'>>) => {
      const syncItem: SyncItem = {
        ...action.payload,
        id: `${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
        retryCount: 0,
      };
      state.queue.push(syncItem);
    },
    removeFromSyncQueue: (state, action: PayloadAction<string>) => {
      state.queue = state.queue.filter(item => item.id !== action.payload);
    },
    clearSyncQueue: state => {
      state.queue = [];
    },
    startSync: state => {
      state.isSyncing = true;
    },
    endSync: state => {
      state.isSyncing = false;
      state.lastSyncTime = Date.now();
    },
    incrementRetryCount: (state, action: PayloadAction<string>) => {
      const item = state.queue.find(item => item.id === action.payload);
      if (item) {
        item.retryCount += 1;
      }
    },
    addSyncError: (state, action: PayloadAction<string>) => {
      state.syncErrors.push(action.payload);
    },
    clearSyncErrors: state => {
      state.syncErrors = [];
    },
  },
});

export const {
  addToSyncQueue,
  removeFromSyncQueue,
  clearSyncQueue,
  startSync,
  endSync,
  incrementRetryCount,
  addSyncError,
  clearSyncErrors,
} = syncSlice.actions;
export default syncSlice.reducer;
