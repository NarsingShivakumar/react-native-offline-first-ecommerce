// src/components/products/ProductCard.tsx
import React from 'react';
import { StyleSheet, View, Text, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Product } from '../../types/api';
import { RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../hooks/useTheme';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addToCart, removeFromCart, updateQuantity } from '../../store/slices/cartSlice';
import Icon from 'react-native-vector-icons/Ionicons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();

  // Check if product is in cart and get quantity
  const cartItem = useAppSelector(state =>
    state.cart.items.find(item => item.id === product.id)
  );
  const quantity = cartItem?.quantity || 0;

  const handlePress = () => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    dispatch(addToCart(product));
  };

  const handleIncrement = (e: any) => {
    e.stopPropagation();
    dispatch(updateQuantity({ id: product.id, quantity: quantity + 1 }));
  };

  const handleDecrement = (e: any) => {
    e.stopPropagation();
    if (quantity === 1) {
      dispatch(removeFromCart(product.id));
    } else {
      dispatch(updateQuantity({ id: product.id, quantity: quantity - 1 }));
    }
  };

  return (
    <Pressable
      style={[styles.card, { backgroundColor: theme.colors.card }]}
      onPress={handlePress}
      android_ripple={{ color: theme.colors.primary + '20' }}>
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.thumbnail }} style={styles.image} resizeMode="cover" />
        {product.discountPercentage > 0 && (
          <View style={[styles.discountBadge, { backgroundColor: theme.colors.error }]}>
            <Text style={styles.discountText}>-{product.discountPercentage.toFixed(0)}%</Text>
          </View>
        )}
      </View>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={2}>
          {product.title}
        </Text>

        <View style={styles.ratingRow}>
          <Icon name="star" size={14} color="#FFD700" />
          <Text style={[styles.rating, { color: theme.colors.text }]}>{product.rating.toFixed(1)}</Text>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.price, { color: theme.colors.primary }]}>${product.price.toFixed(2)}</Text>

          {/* Add to Cart or Quantity Controls */}
          {quantity === 0 ? (
            <Pressable
              style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleAddToCart}>
              <Icon name="add" size={20} color="#FFFFFF" />
            </Pressable>
          ) : (
            <View style={[styles.quantityContainer, { backgroundColor: theme.colors.primary }]}>
              <Pressable style={styles.quantityButton} onPress={handleDecrement}>
                <Icon name="remove" size={16} color="#FFFFFF" />
              </Pressable>
              <Text style={styles.quantityText}>{quantity}</Text>
              <Pressable style={styles.quantityButton} onPress={handleIncrement}>
                <Icon name="add" size={16} color="#FFFFFF" />
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    width: '100%',
    height: 150,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  infoContainer: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    minHeight: 40,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 1,
    height: 32,
  },
  quantityButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 8,
    minWidth: 20,
    textAlign: 'center',
  },
});

export default React.memo(ProductCard);
