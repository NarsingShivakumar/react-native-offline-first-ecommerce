// src/screens/ProductDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  Dimensions,
  ActivityIndicator,
  Share,
  Platform,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { useTheme } from '../hooks/useTheme';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProductById } from '../store/slices/productsSlice';
import { addToCart, updateQuantity, removeFromCart } from '../store/slices/cartSlice';
import { DEEP_LINK_CONFIG } from '../utils/constants';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

const { width, height } = Dimensions.get('window');
const IMAGE_HEIGHT = height * 0.4;

const ProductDetailScreen: React.FC = () => {
  const theme = useTheme();
  const route = useRoute<ProductDetailRouteProp>();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const { productId } = route.params;

  const [selectedImage, setSelectedImage] = useState(0);
  const scrollY = useSharedValue(0);

  const product = useAppSelector(state => state.products.items.find(p => p.id === productId));
  const loading = useAppSelector(state => state.products.loading);

  const cartItem = useAppSelector(state => state.cart.items.find(item => item.id === productId));
  const quantity = cartItem?.quantity || 0;

  useEffect(() => {
    if (!product) {
      dispatch(fetchProductById(productId));
    }
  }, [productId, product, dispatch]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, IMAGE_HEIGHT - 100], [0, 1], Extrapolate.CLAMP);
    return { opacity };
  });

  const imageAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollY.value, [-100, 0], [1.5, 1], Extrapolate.CLAMP);
    const translateY = interpolate(scrollY.value, [0, IMAGE_HEIGHT], [0, -IMAGE_HEIGHT / 2], Extrapolate.CLAMP);
    return {
      transform: [{ scale }, { translateY }],
    };
  });

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart(product));
    }
  };

  const handleIncrement = () => {
    dispatch(updateQuantity({ id: productId, quantity: quantity + 1 }));
  };

  const handleDecrement = () => {
    if (quantity === 1) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(updateQuantity({ id: productId, quantity: quantity - 1 }));
    }
  };

  const handleGoToCart = () => {
    navigation.navigate('Main', { screen: 'Cart' });
  };

  // UPDATED: Better share function with proper deep links
  const handleShare = async () => {
    if (!product) return;

    const webUrl = `https://${DEEP_LINK_CONFIG.HOST}/product/${productId}`;
    const customSchemeUrl = `${DEEP_LINK_CONFIG.SCHEME}://product/${productId}`;

    try {
      const shareContent = {
        title: product.title,
        message: Platform.OS === 'android' 
          ? `Check out ${product.title} - $${product.price.toFixed(2)}\n\n${webUrl}`
          : `Check out ${product.title} - $${product.price.toFixed(2)}`,
        url: webUrl, // iOS uses this
      };

      const result = await Share.share(shareContent);

      if (result.action === Share.sharedAction) {
        console.log('Product shared successfully');
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  if (loading || !product) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Animated Header */}
      <Animated.View style={[styles.header, { backgroundColor: theme.colors.card }, headerAnimatedStyle]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]} numberOfLines={1}>
          {product.title}
        </Text>
      </Animated.View>

      <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
        {/* Product Images */}
        <Animated.View style={[styles.imageContainer, imageAnimatedStyle]}>
          <Image source={{ uri: product.images?.[selectedImage] || product.thumbnail }} style={styles.mainImage} resizeMode="cover" />

          <Pressable style={[styles.shareButton, { backgroundColor: theme.colors.card }]} onPress={handleShare}>
            <Icon name="share-social-outline" size={24} color={theme.colors.text} />
          </Pressable>
        </Animated.View>

        {/* Image Thumbnails */}
        {product.images && product.images.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.thumbnailContainer}
            contentContainerStyle={styles.thumbnailContent}>
            {product.images.map((image, index) => (
              <Pressable
                key={index}
                onPress={() => setSelectedImage(index)}
                style={[
                  styles.thumbnail,
                  {
                    borderColor: selectedImage === index ? theme.colors.primary : 'transparent',
                  },
                ]}>
                <Image source={{ uri: image }} style={styles.thumbnailImage} />
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* Product Info */}
        <View style={[styles.infoContainer, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{product.title}</Text>

          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: theme.colors.primary }]}>${product.price.toFixed(2)}</Text>

            {product.discountPercentage > 0 && (
              <View style={[styles.discountBadge, { backgroundColor: theme.colors.error }]}>
                <Text style={styles.discountText}>-{product.discountPercentage.toFixed(0)}%</Text>
              </View>
            )}
          </View>

          <View style={styles.ratingRow}>
            <Icon name="star" size={18} color="#FFD700" />
            <Text style={[styles.rating, { color: theme.colors.text }]}>{product.rating.toFixed(1)}</Text>
            <Text style={[styles.stock, { color: theme.colors.textSecondary }]}>• {product.stock} in stock</Text>
          </View>

          <View style={styles.divider} />

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Description</Text>
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>{product.description}</Text>

          <View style={styles.divider} />

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Details</Text>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Brand</Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>{product.brand}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Category</Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>{product.category}</Text>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </Animated.ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: theme.colors.card }]}>
        {quantity === 0 ? (
          <Pressable style={[styles.addToCartButton, { backgroundColor: theme.colors.primary }]} onPress={handleAddToCart}>
            <Icon name="cart-outline" size={24} color="#FFFFFF" />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </Pressable>
        ) : (
          <View style={styles.cartActionsContainer}>
            <View style={[styles.quantityControl, { backgroundColor: theme.colors.surface }]}>
              <Pressable style={styles.controlButton} onPress={handleDecrement}>
                <Icon name={quantity === 1 ? 'trash-outline' : 'remove'} size={20} color={theme.colors.primary} />
              </Pressable>

              <Text style={[styles.quantityValue, { color: theme.colors.text }]}>{quantity}</Text>

              <Pressable style={styles.controlButton} onPress={handleIncrement}>
                <Icon name="add" size={20} color={theme.colors.primary} />
              </Pressable>
            </View>

            <Pressable style={[styles.goToCartButton, { backgroundColor: theme.colors.primary }]} onPress={handleGoToCart}>
              <Text style={styles.goToCartText}>Go to Cart</Text>
              <Icon name="arrow-forward" size={20} color="#FFFFFF" />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    height: IMAGE_HEIGHT,
    width: '100%',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  shareButton: {
    position: 'absolute',
    top: 50,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailContainer: {
    marginVertical: 16,
  },
  thumbnailContent: {
    paddingHorizontal: 16,
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 2,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    marginRight: 12,
  },
  discountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rating: {
    fontSize: 16,
    marginLeft: 4,
    fontWeight: '600',
  },
  stock: {
    fontSize: 14,
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  addToCartButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  cartActionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 8,
    height: 56,
  },
  controlButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: '700',
    marginHorizontal: 16,
    minWidth: 30,
    textAlign: 'center',
  },
  goToCartButton: {
    flex: 1,
    flexDirection: 'row',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  goToCartText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ProductDetailScreen;
