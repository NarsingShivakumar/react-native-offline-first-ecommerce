// src/store/middleware/offlineMiddleware.ts
import { Middleware } from '@reduxjs/toolkit';
import NetInfo from '@react-native-community/netinfo';
import type { RootState, AppDispatch } from '../store';
import { addToSyncQueue } from '../slices/syncSlice';

/**
 * Offline Middleware
 * Intercepts actions and queues them when offline
 */

const QUEUEABLE_ACTIONS = ['cart/addToCart', 'cart/removeFromCart', 'cart/updateQuantity'];

export const offlineMiddleware: Middleware = store => next => async action => {
  const netInfo = await NetInfo.fetch();

  // action is now AnyAction (not unknown) with default Middleware typing
  if (!netInfo.isConnected && QUEUEABLE_ACTIONS.includes((action as any).type)) {
    store.dispatch(
      addToSyncQueue({
        action: (action as any).type,
        payload: (action as any).payload,
      }),
    );
  }

  return next(action);
};