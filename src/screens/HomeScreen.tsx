import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  Animated,
  Pressable,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts, fetchProductsByCategory } from '../store/slices/productsSlice';
import ProductList from '../components/products/ProductList';

const { width } = Dimensions.get('window');

interface Tab {
  id: string;
  title: string;
  category?: string;
}

const TABS: Tab[] = [
  { id: 'all', title: 'All Products' },
  { id: 'smartphones', title: 'Smartphones', category: 'smartphones' },
  { id: 'laptops', title: 'Laptops', category: 'laptops' },
  { id: 'fragrances', title: 'Fragrances', category: 'fragrances' },
];

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const products = useAppSelector(state => state.products.items);
  const loading = useAppSelector(state => state.products.loading);
  const activeCategory = useAppSelector(state => state.products.activeCategory);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 30, skip: 0 }));
  }, [dispatch]);

  // Check if current products match this tab
  const isTabDataActive = useCallback(
    (tab: Tab) => {
      if (!tab.category && activeCategory === null) return true;
      if (tab.category === activeCategory) return true;
      return false;
    },
    [activeCategory]
  );

  const handleTabPress = useCallback(
    (index: number) => {
      setActiveTab(index);
      scrollViewRef.current?.scrollTo({
        x: width * index,
        animated: true,
      });

      const tab = TABS[index];
      if (tab.category) {
        dispatch(fetchProductsByCategory(tab.category));
      } else {
        dispatch(fetchProducts({ limit: 30, skip: 0 }));
      }
    },
    [dispatch]
  );

  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / width);

      if (index !== activeTab) {
        handleTabPress(index);
      }
    },
    [activeTab, handleTabPress]
  );

  const indicatorTranslateX = scrollX.interpolate({
    inputRange: TABS.map((_, i) => i * width),
    outputRange: TABS.map((_, i) => i * (width / TABS.length)),
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Tab Header */}
      <View style={[styles.tabHeader, { backgroundColor: theme.colors.card }]}>
        <View style={styles.tabsContainer}>
          {TABS.map((tab, index) => (
            <Pressable key={tab.id} style={styles.tab} onPress={() => handleTabPress(index)}>
              <Text
                style={[
                  styles.tabText,
                  {
                    color: activeTab === index ? theme.colors.primary : theme.colors.textSecondary,
                    fontWeight: activeTab === index ? '600' : '400',
                  },
                ]}>
                {tab.title}
              </Text>
            </Pressable>
          ))}
        </View>

        <Animated.View
          style={[
            styles.indicator,
            {
              backgroundColor: theme.colors.primary,
              transform: [{ translateX: indicatorTranslateX }],
              width: width / TABS.length,
            },
          ]}
        />
      </View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: true,
        })}
        onMomentumScrollEnd={handleScrollEnd}
        style={styles.scrollView}>
        {TABS.map((tab, index) => (
          <View key={tab.id} style={[styles.tabContent, { width }]}>
            <ProductList
              products={isTabDataActive(tab) ? products : []}
              loading={loading && activeTab === index}
              onRefresh={() => {
                if (tab.category) {
                  dispatch(fetchProductsByCategory(tab.category));
                } else {
                  dispatch(fetchProducts({ limit: 30, skip: 0 }));
                }
              }}
              refreshing={loading && activeTab === index}
              // NO onEndReached - removed auto-switch feature
            />
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabHeader: {
    paddingTop: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
  },
  indicator: {
    height: 3,
    borderRadius: 1.5,
  },
  scrollView: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
  },
});

export default HomeScreen;
