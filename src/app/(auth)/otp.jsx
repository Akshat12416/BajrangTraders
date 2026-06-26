import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Ionicons } from '@expo/vector-icons';

export default function OTPScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams();
  const login = useAuthStore(state => state.login);

  const handleVerify = () => {
    login(phone || '9999999999', 'dummy-token', 'CUST-123');
    router.replace('/(tabs)');
  };

  return (
    <View className="flex-1 bg-background px-screen pt-12">
      <TouchableOpacity onPress={() => router.back()} className="mb-section mt-4">
        <Ionicons name="chevron-back" size={24} color="#181725" />
      </TouchableOpacity>
      
      <Text className="text-heading font-bold text-textPrimary mb-2">Enter OTP</Text>
      <Text className="text-body text-textSecondary mb-8">
        Enter the 6-digit code sent to {phone}
      </Text>

      <View className="flex-row justify-between mb-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <TextInput
            key={i}
            className="w-[50px] h-otp-box bg-surface border border-surfaceDark rounded-btn text-center text-title font-bold text-textPrimary"
            keyboardType="number-pad"
            maxLength={1}
          />
        ))}
      </View>

      <Text className="text-textSecondary text-body mb-auto">Resend Code in 60s</Text>

      <TouchableOpacity
        className="h-btn-lg bg-primary rounded-modal items-center justify-center mb-8"
        onPress={handleVerify}
      >
        <Text className="text-textOnPrimary font-bold text-body-md">Verify</Text>
      </TouchableOpacity>
    </View>
  );
}
