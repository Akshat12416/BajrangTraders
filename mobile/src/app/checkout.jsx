import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCartStore } from '../store/cartStore';
import { placeOrder } from '../services/orderService';

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const { items, clearCart } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Form State
  const [customerName, setCustomerName] = useState('ABC PVT LTD');
  const [customerMobile, setCustomerMobile] = useState('9289757820');
  const [shipName, setShipName] = useState('Demo Store Front');
  const [shipAddress, setShipAddress] = useState('123 Main St, Tech Park');
  const [orderRemarks, setOrderRemarks] = useState('Please deliver before 5 PM');

  const handleConfirmOrder = async () => {
    if (!customerName || !customerMobile || !shipAddress) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }

    setIsCheckingOut(true);
    try {
      const meta = {
        customerId: '6732867', // Hardcoded demo customer for now
        customerName,
        customerMobile,
        salesmanId: '001',
        shipName,
        shipAddress1: shipAddress,
        orderRemarks
      };

      await placeOrder(items, meta);
      
      if (Platform.OS === 'web') {
        window.alert('Order Successful!\n\nYour order has been placed in Marg ERP.');
        clearCart();
        router.replace('/(tabs)');
      } else {
        Alert.alert('Order Successful!', 'Your order has been placed in Marg ERP.', [
          { text: 'Great', onPress: () => {
            clearCart();
            router.replace('/(tabs)');
          }}
        ]);
      }
    } catch (error) {
      console.error(error);
      if (Platform.OS === 'web') {
        window.alert('Checkout Failed\n\n' + (error.message || 'There was an error placing your order. Please try again.'));
      } else {
        Alert.alert('Checkout Failed', error.message || 'There was an error placing your order. Please try again.');
      }
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-background" 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View className="px-4 py-4 border-b border-[#F2F3F2] flex-row items-center bg-white" style={{ paddingTop: insets.top + 10 }}>
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#1A6EB4" />
        </TouchableOpacity>
        <Text className="text-title font-bold text-textPrimary">Checkout Details</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        
        <Text className="text-body font-bold text-textPrimary mb-4">Customer Information</Text>
        
        <View className="mb-4">
          <Text className="text-label text-textSecondary mb-2">Customer Name *</Text>
          <TextInput
            className="bg-white border border-surfaceDark rounded-xl px-4 py-3 text-body"
            value={customerName}
            onChangeText={setCustomerName}
            placeholder="Enter business name"
          />
        </View>

        <View className="mb-6">
          <Text className="text-label text-textSecondary mb-2">Mobile Number *</Text>
          <TextInput
            className="bg-white border border-surfaceDark rounded-xl px-4 py-3 text-body"
            value={customerMobile}
            onChangeText={setCustomerMobile}
            keyboardType="phone-pad"
            placeholder="Enter mobile number"
          />
        </View>

        <Text className="text-body font-bold text-textPrimary mb-4">Shipping Details</Text>

        <View className="mb-4">
          <Text className="text-label text-textSecondary mb-2">Ship To Name</Text>
          <TextInput
            className="bg-white border border-surfaceDark rounded-xl px-4 py-3 text-body"
            value={shipName}
            onChangeText={setShipName}
            placeholder="Receiving person/store"
          />
        </View>

        <View className="mb-4">
          <Text className="text-label text-textSecondary mb-2">Delivery Address *</Text>
          <TextInput
            className="bg-white border border-surfaceDark rounded-xl px-4 py-3 text-body min-h-[80px]"
            value={shipAddress}
            onChangeText={setShipAddress}
            multiline
            textAlignVertical="top"
            placeholder="Enter full address"
          />
        </View>

        <View className="mb-6">
          <Text className="text-label text-textSecondary mb-2">Order Remarks</Text>
          <TextInput
            className="bg-white border border-surfaceDark rounded-xl px-4 py-3 text-body"
            value={orderRemarks}
            onChangeText={setOrderRemarks}
            placeholder="Any special instructions?"
          />
        </View>

      </ScrollView>

      {/* Bottom Bar */}
      <View className="bg-white border-t border-[#F2F3F2] px-4 py-4" style={{ paddingBottom: insets.bottom || 16 }}>
        <TouchableOpacity 
          className={`rounded-full py-4 items-center justify-center shadow-sm shadow-black/10 ${isCheckingOut ? 'bg-gray-400' : 'bg-[#1A6EB4]'}`}
          onPress={handleConfirmOrder}
          disabled={isCheckingOut}
        >
          {isCheckingOut ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white font-bold text-body">Confirm Order & Place</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
