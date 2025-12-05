// App.tsx
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store, persistor } from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator';
import OfflineIndicator from './src/components/common/OfflineIndicator';
import { useTheme } from './src/hooks/useTheme';

/**
 * Root App Component
 * Interview: Explain app initialization flow
 * Answer:
 * 1. Redux Provider for global state
 * 2. PersistGate for state rehydration
 * 3. GestureHandlerRootView for gestures
 * 4. AppNavigator for navigation
 * 5. OfflineIndicator for network status
 */

const AppContent: React.FC = () => {
  const theme = useTheme();

  return (
    <>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <AppNavigator />
      <OfflineIndicator />
    </>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AppContent />
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
};

export default App;
