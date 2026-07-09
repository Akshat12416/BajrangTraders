import React, { useState } from 'react';
import { View, Platform, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCartStore } from '../../store/cartStore';
import { placeOrder } from '../../services/orderService';

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + ((item.product.pricePerPiece || item.product.mrp || 0) * item.quantity), 0);
  const minOrder = 1000;

  const handleCheckout = () => {
    if (totalPrice < minOrder) {
      if (Platform.OS === 'web') {
        window.alert(`Minimum Order\n\nPlease add more items to meet the minimum order value of ₹${minOrder}.`);
      } else {
        Alert.alert('Minimum Order', `Please add more items to meet the minimum order value of ₹${minOrder}.`);
      }
      return;
    }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <View className="flex-1 bg-background items-center justify-center" style={{ paddingTop: insets.top }}>
        <Ionicons name="basket-outline" size={80} color="#E2E2E2" />
        <Text className="text-title font-bold text-textPrimary mt-4">Your cart is empty</Text>
        <Text className="text-body text-textSecondary mt-2">Start adding wholesale products!</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      
      {/* Header */}
      <View className="px-4 py-4 border-b border-[#F2F3F2] flex-row items-center justify-between">
        <Text className="text-title font-bold text-textPrimary">Cart ({totalItems})</Text>
        <TouchableOpacity onPress={clearCart}>
          <Text className="text-body text-error font-semibold">Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View className="flex-row border-b border-[#F2F3F2]">
        <View className="flex-1 py-3 items-center border-b-2 border-[#1A6EB4]">
          <Text className="text-body font-bold text-[#1A6EB4]">Cart items</Text>
        </View>
        <View className="flex-1 py-3 items-center">
          <Text className="text-body text-textSecondary">Checkout</Text>
        </View>
        <View className="flex-1 py-3 items-center">
          <Text className="text-body text-textSecondary">Delivery</Text>
        </View>
      </View>

      {/* Cart Items */}
      <ScrollView contentContainerStyle={{ paddingBottom: 180, paddingTop: 8 }}>
        {items.map((item) => (
          <View key={item.productId} className="flex-row items-center px-4 py-3 border-b border-[#F2F3F2]">
            
            {/* Checkbox */}
            <TouchableOpacity className="mr-3">
              <Ionicons name="checkmark-circle" size={22} color="#1A6EB4" />
            </TouchableOpacity>

            {/* Image or Fallback */}
            {item.product.image ? (
              <Image 
                source={{ uri: item.product.image }} 
                className="w-14 h-14 rounded-xl bg-[#F2F3F2]" 
                resizeMode="cover" 
              />
            ) : (
              <View className="w-14 h-14 rounded-xl bg-[#F2F3F2] items-center justify-center">
                 <Ionicons name="cube-outline" size={24} color="#B3B3B3" />
              </View>
            )}

            {/* Info */}
            <View className="flex-1 ml-3">
              <View className="flex-row items-center">
                <Text className="text-body font-bold text-[#1A6EB4] mr-1">₹{item.product.pricePerPiece || item.product.mrp}</Text>
                {item.product.mrp && item.product.pricePerPiece && item.product.mrp > item.product.pricePerPiece && (
                  <Text className="text-[10px] text-textSecondary line-through">₹{item.product.mrp}</Text>
                )}
              </View>
              <Text className="text-body font-semibold text-textPrimary" numberOfLines={1}>{item.product.name}</Text>
              <Text className="text-[10px] text-textSecondary">{item.product.unit}</Text>
            </View>

            {/* Quantity Controls */}
            <View className="flex-row items-center bg-[#1A6EB4] rounded-full px-2 py-1">
              <TouchableOpacity 
                onPress={() => updateQuantity(item.productId, item.quantity - 1)}
                className="w-6 h-6 items-center justify-center"
              >
                <Ionicons name="remove" size={16} color="white" />
              </TouchableOpacity>
              <Text className="text-white font-bold text-body mx-2">{item.quantity} pcs</Text>
              <TouchableOpacity 
                onPress={() => updateQuantity(item.productId, item.quantity + 1)}
                className="w-6 h-6 items-center justify-center"
              >
                <Ionicons name="add" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#F2F3F2]" style={{ paddingBottom: insets.bottom + 80 }}>
        {totalPrice < minOrder && (
          <View className="bg-[#E6F3FA] px-4 py-2">
            <Text className="text-label text-[#1A6EB4] text-center">
              Add more items to meet the ₹{minOrder} min order value
            </Text>
          </View>
        )}
        <View className="px-4 pt-3 pb-3 flex-row items-center justify-between">
          <View>
            <Text className="text-label text-textSecondary">Total (without tax)</Text>
            <Text className="text-title font-bold text-[#1A6EB4]">₹{totalPrice.toFixed(2)}</Text>
          </View>
          
          <TouchableOpacity 
            className={`rounded-full px-8 py-3.5 flex-row items-center shadow-sm shadow-black/10 ${totalPrice < minOrder || isCheckingOut ? 'bg-gray-400' : 'bg-[#1A6EB4]'}`}
            onPress={handleCheckout}
            disabled={totalPrice < minOrder || isCheckingOut}
          >
            {isCheckingOut ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Text className="text-white font-bold text-body-md mr-1">Checkout</Text>
                <Ionicons name="chevron-forward" size={18} color="white" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
