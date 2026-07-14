import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOrderStore } from '../store/orderStore';

export default function OrderDetailScreen() {
  const { orderId, isPending } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const pendingOrders = useOrderStore(state => state.pendingOrders);
  const billedOrders = useOrderStore(state => state.billedOrders);

  // Find the order in either pending or billed lists
  const isPendingBool = isPending === 'true';
  const order = isPendingBool 
    ? pendingOrders.find(o => o.id === orderId)
    : billedOrders.find(o => o.id === orderId);

  if (!order) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <Text className="text-textSecondary">Order not found.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-[#1A6EB4] px-6 py-2 rounded-full">
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const orderDate = new Date(order.date).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-4 py-4 flex-row items-center bg-white border-b border-[#F2F3F2]">
        <TouchableOpacity onPress={() => router.back()} className="mr-4 w-10 h-10 items-center justify-center rounded-full bg-[#F2F3F2]">
          <Ionicons name="chevron-back" size={20} color="#181725" />
        </TouchableOpacity>
        <Text className="text-title font-bold text-textPrimary">Order Details</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        
        {/* Order Summary Card */}
        <View className="bg-white rounded-[20px] p-5 mb-6 border border-[#F2F3F2] shadow-sm shadow-black/5">
          <View className="flex-row justify-between items-start mb-4">
            <View>
              <Text className="text-body font-bold text-textPrimary">Order #{order.orderNo || order.id}</Text>
              <Text className="text-label text-textSecondary mt-1">{orderDate}</Text>
            </View>
            <View className={`${isPendingBool ? 'bg-[#FFF5E6]' : 'bg-[#E6F3FA]'} px-3 py-1 rounded-full`}>
              <Text className={`${isPendingBool ? 'text-[#E28E25]' : 'text-[#1A6EB4]'} text-[10px] font-bold`}>
                {isPendingBool ? 'Pending' : 'Billed'}
              </Text>
            </View>
          </View>

          <View className="border-t border-[#F2F3F2] pt-4 mb-4">
            <Text className="text-label text-textSecondary mb-1">Total Amount</Text>
            <Text className="text-title font-bold text-[#E2523A]">₹{(order.total || 0).toLocaleString()}</Text>
          </View>

          {/* Delivery Details (only stored locally on pending orders currently) */}
          {order.shipAddress && (
            <View className="border-t border-[#F2F3F2] pt-4">
              <Text className="text-label text-textSecondary mb-1">Delivery Address</Text>
              <Text className="text-body text-textPrimary">{order.shipAddress}</Text>
            </View>
          )}
        </View>

        {/* Order Items */}
        <Text className="text-title-sm font-bold text-textPrimary mb-4">Items Ordered</Text>

        {!isPendingBool ? (
          // Billed orders from Marg API do not have line items
          <View className="bg-white rounded-[20px] border border-[#F2F3F2] p-8 items-center justify-center">
            <Ionicons name="receipt-outline" size={48} color="#E2E2E2" />
            <Text className="text-body text-textSecondary mt-4 text-center">
              Itemized details are unavailable for billed invoices from the ERP. Please check your physical bill.
            </Text>
          </View>
        ) : (
          <View className="bg-white rounded-[20px] border border-[#F2F3F2] overflow-hidden shadow-sm shadow-black/5">
            {order.items?.map((item, index) => {
              const prod = item.product;
              const name = prod?.name || item.name || 'Unknown Item';
              const price = prod?.pricePerPiece || prod?.mrp || item.price || 0;
              const image = prod?.image;

              return (
                <View 
                  key={index} 
                  className={`p-4 flex-row items-center ${index !== order.items.length - 1 ? 'border-b border-[#F2F3F2]' : ''}`}
                >
                  <View className="w-16 h-16 rounded-xl bg-[#F0F6FA] items-center justify-center mr-4 border border-[#E5E5E5]">
                    {image ? (
                      <Image source={{ uri: image }} className="w-12 h-12 rounded-lg" resizeMode="contain" />
                    ) : (
                      <Ionicons name="cube-outline" size={24} color="#B3B3B3" />
                    )}
                  </View>
                  
                  <View className="flex-1">
                    <Text className="text-body font-bold text-textPrimary mb-1" numberOfLines={2}>{name}</Text>
                    {prod?.unit && (
                      <Text className="text-[10px] text-textSecondary mb-1">{prod.unit}</Text>
                    )}
                    <View className="flex-row justify-between items-center mt-1">
                      <Text className="text-label text-textSecondary">Qty: {item.quantity}</Text>
                      <Text className="text-body font-bold text-textPrimary">₹{price * item.quantity}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
