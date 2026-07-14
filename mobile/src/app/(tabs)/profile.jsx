import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const customer = useAuthStore(state => state.customer);
  const logout = useAuthStore(state => state.logout);
  const clearCart = useCartStore(state => state.clearCart);

  const handleLogout = () => {
    // Ideally use Alert for confirmation, but for web compatibility we'll just log out
    if (window.confirm && typeof window.confirm === 'function') {
      if (window.confirm('Are you sure you want to log out?')) {
        performLogout();
      }
    } else {
      performLogout();
    }
  };

  const performLogout = () => {
    clearCart();
    logout();
    router.replace('/(auth)/login');
  };

  if (!customer) return null;

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center justify-between border-b border-[#F2F3F2] bg-white">
        <Text className="text-title font-bold text-textPrimary">My Profile</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }}>
        
        {/* User Card */}
        <View className="bg-white rounded-2xl p-6 border border-[#F2F3F2] shadow-sm shadow-black/5 mb-6 flex-row items-center">
          <View className="w-16 h-16 rounded-full bg-[#1A6EB4] items-center justify-center mr-4">
            <Text className="text-white text-title font-bold">
              {customer.name ? customer.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-title-sm font-bold text-textPrimary mb-1" numberOfLines={2}>
              {customer.name}
            </Text>
            <Text className="text-body text-textSecondary">{customer.phone}</Text>
          </View>
        </View>

        {/* Business Details */}
        <Text className="text-title-sm font-bold text-textPrimary mb-4">Business Details</Text>
        <View className="bg-white rounded-2xl border border-[#F2F3F2] overflow-hidden shadow-sm shadow-black/5 mb-6">
          <View className="p-4 border-b border-[#F2F3F2] flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-[#F0F6FA] items-center justify-center mr-3">
              <Ionicons name="business-outline" size={20} color="#1A6EB4" />
            </View>
            <View className="flex-1">
              <Text className="text-label text-textSecondary">Account ID (Marg ERP)</Text>
              <Text className="text-body font-semibold text-textPrimary mt-0.5">{customer.id}</Text>
            </View>
          </View>
          
          <View className="p-4 border-b border-[#F2F3F2] flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-[#F0F6FA] items-center justify-center mr-3">
              <Ionicons name="document-text-outline" size={20} color="#1A6EB4" />
            </View>
            <View className="flex-1">
              <Text className="text-label text-textSecondary">GSTIN Number</Text>
              <Text className="text-body font-semibold text-textPrimary mt-0.5">
                {customer.gstNo || 'Not Provided'}
              </Text>
            </View>
          </View>

          <View className="p-4 flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-[#F0F6FA] items-center justify-center mr-3">
              <Ionicons name="location-outline" size={20} color="#1A6EB4" />
            </View>
            <View className="flex-1">
              <Text className="text-label text-textSecondary">Billing Address</Text>
              <Text className="text-body font-semibold text-textPrimary mt-0.5 leading-5">
                {customer.address || 'Address not registered'}
              </Text>
            </View>
          </View>
        </View>

        {/* Settings & Support */}
        <Text className="text-title-sm font-bold text-textPrimary mb-4">Settings</Text>
        <View className="bg-white rounded-2xl border border-[#F2F3F2] overflow-hidden shadow-sm shadow-black/5 mb-8">
          <TouchableOpacity className="p-4 border-b border-[#F2F3F2] flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="notifications-outline" size={22} color="#181725" className="mr-3" />
              <Text className="text-body font-semibold text-textPrimary ml-3">Notifications</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#B3B3B3" />
          </TouchableOpacity>
          
          <TouchableOpacity className="p-4 border-b border-[#F2F3F2] flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="help-circle-outline" size={22} color="#181725" className="mr-3" />
              <Text className="text-body font-semibold text-textPrimary ml-3">Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#B3B3B3" />
          </TouchableOpacity>

          <TouchableOpacity className="p-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="information-circle-outline" size={22} color="#181725" className="mr-3" />
              <Text className="text-body font-semibold text-textPrimary ml-3">About App</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#B3B3B3" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          className="bg-[#F2F3F2] rounded-2xl py-4 flex-row items-center justify-center mb-8"
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={22} color="#E2523A" className="mr-2" />
          <Text className="text-error font-bold text-body ml-2">Log Out</Text>
        </TouchableOpacity>
        
        <Text className="text-center text-label text-textSecondary mb-2">Version 1.0.0</Text>
        <Text className="text-center text-label text-textSecondary">Powered by Marg ERP Corporate Demo</Text>

      </ScrollView>
    </View>
  );
}
