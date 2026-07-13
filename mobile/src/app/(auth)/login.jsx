import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { sendOtpApi } from '../../services/authService';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const insets = useSafeAreaInsets();

  const handleSendOTP = async () => {
    if (phone.length === 10) {
      setLoading(true);
      setError(null);
      try {
        await sendOtpApi(phone);
        router.push({ pathname: '/(auth)/otp', params: { phone } });
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-background" 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ paddingTop: insets.top }}
    >
      <View className="flex-1 px-6 justify-between pb-8">
        
        {/* Top Section */}
        <View className="items-center mt-16">
          {/* Logo */}
          <View className="w-20 h-20 bg-[#E6F3FA] rounded-full items-center justify-center mb-6">
            <Ionicons name="storefront" size={36} color="#1A6EB4" />
          </View>
          <Text className="text-heading font-bold text-textPrimary mb-1">Welcome Back!</Text>
          <Text className="text-body text-textSecondary text-center">
            Sign in to access your wholesale orders
          </Text>
        </View>

        {/* Form Section */}
        <View className="mt-10">
          <Text className="text-label font-semibold text-textSecondary mb-2 ml-1">PHONE NUMBER</Text>
          <View className="flex-row items-center h-[56px] bg-white border border-surfaceDark rounded-2xl px-4 mb-2">
            <View className="flex-row items-center mr-3 pr-3 border-r border-surfaceDark">
              <Text className="text-body-md font-semibold text-textPrimary">🇮🇳 +91</Text>
            </View>
            <TextInput
              className="flex-1 text-body-md text-textPrimary"
              placeholder="Enter 10-digit number"
              placeholderTextColor="#B3B3B3"
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                setError(null);
              }}
            />
          </View>

          {error && <Text className="text-error text-label mb-4">{error}</Text>}
          {!error && <View className="h-4" />}

          <TouchableOpacity
            className={`h-[56px] rounded-2xl items-center justify-center shadow-sm shadow-black/10 ${phone.length >= 10 && !loading ? 'bg-[#1A6EB4]' : 'bg-[#B3B3B3]'}`}
            onPress={handleSendOTP}
            disabled={phone.length < 10 || loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-body-md">Send OTP</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Bottom Section */}
        <View className="items-center mt-auto pt-8">
          <Text className="text-[10px] text-textHint text-center">
            By continuing, you agree to our Terms of Service{'\n'}and Privacy Policy
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
