import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');

  const handleSendOTP = () => {
    router.push({ pathname: '/(auth)/otp', params: { phone } });
  };

  return (
    <View className="flex-1 bg-background px-screen pt-12">
      <View className="h-40 justify-center items-center mb-section">
        <View className="w-full h-full bg-surfaceDark rounded-card-lg items-center justify-center">
          <Text className="text-textSecondary">Grocery App Image</Text>
        </View>
      </View>
      <Text className="text-heading font-bold text-textPrimary mb-2">Login</Text>
      <Text className="text-body text-textSecondary mb-8">Enter your phone number to continue</Text>

      <TextInput
        className="h-input bg-surface px-input rounded-btn text-body-md text-textPrimary mb-auto"
        placeholder="Phone Number"
        placeholderTextColor="#B3B3B3"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <TouchableOpacity
        className="h-btn-lg bg-primary rounded-modal items-center justify-center mb-8"
        onPress={handleSendOTP}
      >
        <Text className="text-textOnPrimary font-bold text-body-md">Send OTP</Text>
      </TouchableOpacity>
    </View>
  );
}
