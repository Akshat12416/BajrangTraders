import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getOrderHistory } from '../../services/historyService';
import { useAuthStore } from '../../store/authStore';

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const customerId = useAuthStore(state => state.customer?.id);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (customerId) {
      fetchOrders();
    }
  }, [customerId]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrderHistory(customerId);
      setOrders(data);
    } catch (err) {
      setError(err.message || 'Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center border-b border-[#F2F3F2]">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-[#F2F3F2] items-center justify-center mr-4"
        >
          <Ionicons name="chevron-back" size={20} color="#181725" />
        </TouchableOpacity>
        <Text className="text-title font-bold text-textPrimary">My Orders</Text>
      </View>

      {/* Info Banner */}
      <View className="bg-[#E6F3FA] px-6 py-3 border-b border-[#1A6EB4]/20 flex-row items-center">
        <Ionicons name="information-circle" size={20} color="#1A6EB4" />
        <Text className="text-label text-[#1A6EB4] ml-2 flex-1">
          Only billed orders (invoices) appear here. Newly placed orders are processed by the distributor first.
        </Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1A6EB4" />
          <Text className="text-body text-textSecondary mt-4">Loading Orders...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-error text-center mb-4 text-body">{error}</Text>
          <TouchableOpacity onPress={fetchOrders} className="bg-[#1A6EB4] px-6 py-3 rounded-full">
            <Text className="text-white font-bold">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }}>
          {orders.length === 0 ? (
            <View className="bg-white rounded-[20px] border border-[#F2F3F2] p-8 items-center justify-center mt-10">
              <Ionicons name="receipt-outline" size={48} color="#E2E2E2" />
              <Text className="text-title-sm font-bold text-textPrimary mt-4 text-center">No Orders Yet</Text>
              <Text className="text-body text-textSecondary mt-2 text-center">
                Your past orders will appear here once they are invoiced.
              </Text>
              <TouchableOpacity 
                className="mt-6 bg-[#1A6EB4] px-6 py-3 rounded-full"
                onPress={() => router.push('/')}
              >
                <Text className="text-white font-bold">Start Shopping</Text>
              </TouchableOpacity>
            </View>
          ) : (
            orders.map((order, index) => (
              <TouchableOpacity 
                key={order.id + index}
                className="bg-white rounded-[20px] p-5 mb-4 border border-[#F2F3F2] shadow-sm shadow-black/5"
                activeOpacity={0.7}
              >
                <View className="flex-row justify-between items-center mb-3">
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-full bg-[#F0F6FA] items-center justify-center mr-3">
                      <Ionicons name="cube" size={20} color="#1A6EB4" />
                    </View>
                    <View>
                      <Text className="text-body font-bold text-textPrimary">Order #{order.orderNo}</Text>
                      <Text className="text-label text-textSecondary">
                        {new Date(order.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </Text>
                    </View>
                  </View>
                  <View className="bg-[#E6F3FA] px-3 py-1 rounded-full">
                    <Text className="text-[#1A6EB4] text-[10px] font-bold">Billed</Text>
                  </View>
                </View>
                
                <View className="border-t border-[#F2F3F2] pt-3 flex-row justify-between items-center">
                  <Text className="text-label text-textSecondary">Total Amount</Text>
                  <Text className="text-title-sm font-bold text-[#E2523A]">₹{order.total}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}
