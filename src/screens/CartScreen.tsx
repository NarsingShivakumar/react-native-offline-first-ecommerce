import React from 'react';
import { StyleSheet, View, Text, FlatList, Image, Pressable } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

/**
 * Cart Screen with Offline Support
 */

const CartScreen: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { isConnected } = useNetworkStatus();

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const total = useSelector((state: RootState) => state.cart.total);

  const handleRemoveItem = (id: number) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQuantity = (id: number, delta: number) => {
    const item = cartItems.find(i => i.id === id);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + delta);
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleCheckout = () => {
    console.log('Proceeding to checkout...');
  };

  if (cartItems.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background }]}>
        <Icon name="cart-outline" size={80} color={theme.colors.textSecondary} />
        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>Your cart is empty</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Offline Indicator */}
      {!isConnected && (
        <View style={[styles.offlineBar, { backgroundColor: theme.colors.warning }]}>
          <Icon name="cloud-offline-outline" size={16} color="#FFFFFF" />
          <Text style={styles.offlineText}>You're offline. Changes will sync when online.</Text>
        </View>
      )}

      <FlatList
        data={cartItems}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.cartItem, { backgroundColor: theme.colors.card }]}>
            <Image source={{ uri: item.thumbnail }} style={styles.itemImage} />

            <View style={styles.itemInfo}>
              <Text style={[styles.itemTitle, { color: theme.colors.text }]} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={[styles.itemPrice, { color: theme.colors.primary }]}>${item.price.toFixed(2)}</Text>

              <View style={styles.quantityContainer}>
                <Pressable style={[styles.quantityButton, { backgroundColor: theme.colors.surface }]} onPress={() => handleUpdateQuantity(item.id, -1)}>
                  <Icon name="remove" size={20} color={theme.colors.text} />
                </Pressable>

                <Text style={[styles.quantity, { color: theme.colors.text }]}>{item.quantity}</Text>

                <Pressable style={[styles.quantityButton, { backgroundColor: theme.colors.surface }]} onPress={() => handleUpdateQuantity(item.id, 1)}>
                  <Icon name="add" size={20} color={theme.colors.text} />
                </Pressable>
              </View>
            </View>

            <Pressable style={styles.removeButton} onPress={() => handleRemoveItem(item.id)}>
              <Icon name="trash-outline" size={24} color={theme.colors.error} />
            </Pressable>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: theme.colors.card }]}>
        <View style={styles.totalContainer}>
          <Text style={[styles.totalLabel, { color: theme.colors.textSecondary }]}>Total</Text>
          <Text style={[styles.totalAmount, { color: theme.colors.text }]}>${total.toFixed(2)}</Text>
        </View>

        <Pressable
          style={[
            styles.checkoutButton,
            {
              backgroundColor: theme.colors.primary,
              opacity: !isConnected ? 0.5 : 1,
            },
          ]}
          onPress={handleCheckout}
          disabled={!isConnected}>
          <Text style={styles.checkoutText}>{isConnected ? 'Proceed to Checkout' : 'Available when online'}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  offlineBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  offlineText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 14,
  },
  listContent: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 16,
  },
  removeButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    marginTop: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
  },
  checkoutButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CartScreen;
