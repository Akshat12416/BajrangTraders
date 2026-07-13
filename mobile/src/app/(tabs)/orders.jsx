import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getOrderHistory } from '../../services/historyService';
import { useAuthStore } from '../../store/authStore';
import { useOrderStore } from '../../store/orderStore';

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const customerId = useAuthStore(state => state.customer?.id);
  const pendingOrders = useOrderStore(state => state.pendingOrders);

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

  const renderOrderCard = (order, isPending = false) => (
    <TouchableOpacity 
      key={order.id}
      className="bg-white rounded-[20px] p-5 mb-4 border border-[#F2F3F2] shadow-sm shadow-black/5"
      activeOpacity={0.7}
    >
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center">
          <View className={`w-10 h-10 rounded-full ${isPending ? 'bg-[#FFF5E6]' : 'bg-[#F0F6FA]'} items-center justify-center mr-3`}>
            <Ionicons name="cube" size={20} color={isPending ? '#E28E25' : '#1A6EB4'} />
          </View>
          <View>
            <Text className="text-body font-bold text-textPrimary">Order #{order.orderNo || order.id}</Text>
            <Text className="text-label text-textSecondary">
              {new Date(order.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>
        <View className={`${isPending ? 'bg-[#FFF5E6]' : 'bg-[#E6F3FA]'} px-3 py-1 rounded-full`}>
          <Text className={`${isPending ? 'text-[#E28E25]' : 'text-[#1A6EB4]'} text-[10px] font-bold`}>
            {isPending ? 'Pending' : 'Billed'}
          </Text>
        </View>
      </View>
      
      {isPending && order.items && (
        <View className="mb-3">
          <Text className="text-label text-textSecondary mb-1">{order.items.length} Items:</Text>
          {order.items.slice(0, 2).map((item, idx) => (
            <Text key={idx} className="text-label font-semibold text-textPrimary" numberOfLines={1}>
              {item.quantity}x {item.name}
            </Text>
          ))}
          {order.items.length > 2 && (
            <Text className="text-label text-[#1A6EB4] italic mt-1">+{order.items.length - 2} more items</Text>
          )}
        </View>
      )}
      
      <View className="border-t border-[#F2F3F2] pt-3 flex-row justify-between items-center">
        <Text className="text-label text-textSecondary">Total Amount</Text>
        <Text className="text-title-sm font-bold text-[#E2523A]">₹{(order.total || 0).toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );

  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'billed'

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-6 py-4 flex-row justify-between items-center bg-white border-b border-[#F2F3F2]">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-[#F2F3F2] items-center justify-center mr-4"
          >
            <Ionicons name="chevron-back" size={20} color="#181725" />
          </TouchableOpacity>
          <Text className="text-title font-bold text-textPrimary">My Orders</Text>
        </View>
        <TouchableOpacity 
          onPress={() => {
            const { useOrderStore } = require('../../store/orderStore');
            useOrderStore.getState().clearOrders();
          }}
        >
          <Text className="text-error font-bold text-label">Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Custom Tabs */}
      <View className="flex-row px-6 py-2 bg-white border-b border-[#F2F3F2]">
        <TouchableOpacity 
          className={`flex-1 py-3 items-center border-b-2 ${activeTab === 'pending' ? 'border-[#1A6EB4]' : 'border-transparent'}`}
          onPress={() => setActiveTab('pending')}
        >
          <Text className={`font-bold ${activeTab === 'pending' ? 'text-[#1A6EB4]' : 'text-textSecondary'}`}>
            Pending Approval
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className={`flex-1 py-3 items-center border-b-2 ${activeTab === 'billed' ? 'border-[#1A6EB4]' : 'border-transparent'}`}
          onPress={() => setActiveTab('billed')}
        >
          <Text className={`font-bold ${activeTab === 'billed' ? 'text-[#1A6EB4]' : 'text-textSecondary'}`}>
            Billed Invoices
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }}>
        
        {activeTab === 'pending' ? (
          /* Pending Orders Section */
          pendingOrders && pendingOrders.length > 0 ? (
            pendingOrders.map(order => renderOrderCard(order, true))
          ) : (
            <View className="bg-white rounded-[20px] border border-[#F2F3F2] p-8 items-center justify-center mt-2">
              <Ionicons name="time-outline" size={48} color="#E2E2E2" />
              <Text className="text-body text-textSecondary mt-4 text-center">
                You have no pending orders.
              </Text>
            </View>
          )
        ) : (
          /* Billed Invoices Section */
          loading ? (
            <View className="flex-1 items-center justify-center py-10">
              <ActivityIndicator size="large" color="#1A6EB4" />
            </View>
          ) : error ? (
            <View className="items-center justify-center py-6">
              <Text className="text-error text-center mb-4 text-body">{error}</Text>
              <TouchableOpacity onPress={fetchOrders} className="bg-[#1A6EB4] px-6 py-3 rounded-full">
                <Text className="text-white font-bold">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : orders.length === 0 ? (
            <View className="bg-white rounded-[20px] border border-[#F2F3F2] p-8 items-center justify-center mt-2">
              <Ionicons name="receipt-outline" size={48} color="#E2E2E2" />
              <Text className="text-body text-textSecondary mt-4 text-center">
                Your invoiced orders will appear here.
              </Text>
            </View>
          ) : (
            orders.map(order => renderOrderCard(order, false))
          )
        )}
      </ScrollView>
    </View>
  );
}
