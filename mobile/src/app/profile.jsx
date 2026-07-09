import React, { useEffect, useState } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getCustomerProfile } from '../services/customerService';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      // By default, this uses our demo customer 6732867
      const data = await getCustomerProfile();
      setCustomer(data);
    } catch (err) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // In a real app we'd clear auth state here
    router.replace('/(auth)/login');
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
        <Text className="text-title font-bold text-textPrimary">Profile</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        {/* Profile Info */}
        <View className="bg-white rounded-[20px] p-6 shadow-sm shadow-black/5 border border-[#F2F3F2] items-center mb-6">
          <View className="w-20 h-20 bg-[#E6F3FA] rounded-full items-center justify-center mb-4 border-2 border-[#1A6EB4]">
            <Ionicons name="person" size={40} color="#1A6EB4" />
          </View>
          
          {loading ? (
            <ActivityIndicator size="small" color="#1A6EB4" className="my-4" />
          ) : error ? (
            <View className="items-center">
              <Text className="text-error text-center mb-2">{error}</Text>
              <TouchableOpacity onPress={fetchProfile} className="bg-[#1A6EB4] px-4 py-2 rounded-full">
                <Text className="text-white font-bold">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : customer ? (
            <>
              <Text className="text-title font-bold text-textPrimary mb-1 text-center">{customer.name}</Text>
              <Text className="text-body text-textSecondary mb-4 text-center">{customer.mobile || '+91 99999 99999'}</Text>
    
              <View className="bg-[#F0F6FA] px-4 py-3 rounded-xl flex-row items-center w-full">
                <Ionicons name="location" size={20} color="#1A6EB4" />
                <Text className="text-label font-bold text-[#1A6EB4] ml-2 flex-1" numberOfLines={2}>
                  {customer.address || 'Store Location'} {customer.city ? `, ${customer.city}` : ''}
                </Text>
              </View>
            </>
          ) : null}
        </View>

        {/* Links */}
        <View className="bg-white rounded-[20px] border border-[#F2F3F2] overflow-hidden mb-6 shadow-sm shadow-black/5">
          <TouchableOpacity 
            className="flex-row items-center px-6 py-4 border-b border-[#F2F3F2]"
            onPress={() => router.push('/(tabs)/orders')}
          >
            <MaterialCommunityIcons name="file-document-outline" size={24} color="#181725" />
            <Text className="flex-1 ml-4 text-body font-semibold text-textPrimary">My Orders</Text>
            <Ionicons name="chevron-forward" size={20} color="#181725" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center px-6 py-4 border-b border-[#F2F3F2]">
            <MaterialCommunityIcons name="storefront-outline" size={24} color="#181725" />
            <Text className="flex-1 ml-4 text-body font-semibold text-textPrimary">Linked Shops</Text>
            <Ionicons name="chevron-forward" size={20} color="#181725" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center px-6 py-4">
            <Ionicons name="settings-outline" size={24} color="#181725" />
            <Text className="flex-1 ml-4 text-body font-semibold text-textPrimary">Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#181725" />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity
          className="flex-row items-center justify-center bg-[#FFF2F2] rounded-2xl py-4 border border-[#FFB3B3]"
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#E2523A" />
          <Text className="ml-2 text-body font-bold text-[#E2523A]">Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
