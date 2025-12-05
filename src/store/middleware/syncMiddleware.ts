import { Middleware } from '@reduxjs/toolkit';
import NetInfo from '@react-native-community/netinfo';
import type { RootState, AppDispatch } from '../store';
import { startSync, endSync, removeFromSyncQueue } from '../slices/syncSlice';

/**
 * Sync Middleware
 * Processes offline queue when connection restored
 */

let isProcessing = false;

export const syncMiddleware: Middleware = store => {

    NetInfo.addEventListener(async state => {
      if (state.isConnected && !isProcessing) {
        const syncQueue = store.getState().sync.queue;

        if (syncQueue.length > 0) {
          isProcessing = true;
          store.dispatch(startSync());

          for (const item of syncQueue) {
            try {
              store.dispatch({
                type: item.action,
                payload: item.payload,
              });
              store.dispatch(removeFromSyncQueue(item.id));
            } catch (error) {
              console.error('Sync error:', error);
            }
          }

          store.dispatch(endSync());
          isProcessing = false;
        }
      }
    });

    return next => action => next(action);
  };

