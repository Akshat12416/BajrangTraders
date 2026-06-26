import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

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

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {/* Profile Info */}
        <View className="bg-white rounded-[20px] p-6 shadow-sm shadow-black/5 border border-[#F2F3F2] items-center mb-6">
          <View className="w-20 h-20 bg-[#E6F3FA] rounded-full items-center justify-center mb-4 border-2 border-[#1A6EB4]">
            <Ionicons name="person" size={40} color="#1A6EB4" />
          </View>
          <Text className="text-title font-bold text-textPrimary mb-1">Ramesh Kumar</Text>
          <Text className="text-body text-textSecondary mb-4">+91 98765 43210</Text>

          <View className="bg-[#F0F6FA] px-4 py-2 rounded-full flex-row items-center">
            <Ionicons name="location" size={16} color="#1A6EB4" />
            <Text className="text-label font-bold text-[#1A6EB4] ml-2">Store 476CP (Main Branch)</Text>
          </View>
        </View>

        {/* Links */}
        <View className="bg-white rounded-[20px] border border-[#F2F3F2] overflow-hidden mb-6 shadow-sm shadow-black/5">
          <TouchableOpacity className="flex-row items-center px-6 py-4 border-b border-[#F2F3F2]">
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
