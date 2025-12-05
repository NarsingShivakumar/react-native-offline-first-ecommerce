import React, { useEffect, useCallback, useState } from 'react';
import { StyleSheet, View, TextInput, Pressable } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchProducts, searchProducts, resetProducts } from '../store/slices/productsSlice';
import ProductList from '../components/products/ProductList';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDebounce } from '../hooks/useDebounce';

/**
 * Products Screen with Search and Infinite Scroll
 */

const ProductsScreen: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);

  const products = useSelector((state: RootState) => state.products.items);
  const loading = useSelector((state: RootState) => state.products.loading);
  const pagination = useSelector((state: RootState) => state.products.pagination);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (!isSearchMode) {
      dispatch(fetchProducts({ limit: 30, skip: 0 }));
    }
  }, [dispatch, isSearchMode]);

  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      setIsSearchMode(true);
      dispatch(searchProducts(debouncedSearchQuery));
    } else if (isSearchMode) {
      setIsSearchMode(false);
      dispatch(resetProducts());
      dispatch(fetchProducts({ limit: 30, skip: 0 }));
    }
  }, [debouncedSearchQuery, dispatch, isSearchMode]);

  const handleLoadMore = useCallback(() => {
    if (!loading && !isSearchMode && pagination.skip + pagination.limit < pagination.total) {
      dispatch(
        fetchProducts({
          limit: 30,
          skip: pagination.skip + pagination.limit,
        })
      );
    }
  }, [loading, isSearchMode, pagination, dispatch]);

  const handleRefresh = useCallback(() => {
    if (isSearchMode && searchQuery.trim()) {
      dispatch(searchProducts(searchQuery));
    } else {
      dispatch(resetProducts());
      dispatch(fetchProducts({ limit: 30, skip: 0 }));
    }
  }, [isSearchMode, searchQuery, dispatch]);

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearchMode(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.card }]}>
        <View style={[styles.searchInputWrapper, { backgroundColor: theme.colors.surface }]}>
          <Icon name="search-outline" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search products..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={clearSearch}>
              <Icon name="close-circle" size={20} color={theme.colors.textSecondary} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Products List */}
      <ProductList
        products={products}
        loading={loading}
        onEndReached={handleLoadMore}
        onRefresh={handleRefresh}
        refreshing={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
});

export default ProductsScreen;
