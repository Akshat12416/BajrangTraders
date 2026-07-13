import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useRef } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function OTPScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams();
  const login = useAuthStore(state => state.login);
  const insets = useSafeAreaInsets();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isComplete = otp.every(d => d !== '');

  const handleVerify = async () => {
    const otpString = otp.join('');
    setLoading(true);
    setError(null);
    try {
      const { verifyOtpApi } = require('../../services/authService');
      const response = await verifyOtpApi(phone, otpString);
      
      // Save to auth store
      login(response.data.token, response.data.customer);
      
      router.replace('/(tabs)');
    } catch (err) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-background" 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ paddingTop: insets.top }}
    >
      <View className="flex-1 px-6 pb-8">
        
        {/* Back Button */}
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="w-10 h-10 rounded-full bg-[#F2F3F2] items-center justify-center mt-4 mb-8"
        >
          <Ionicons name="chevron-back" size={20} color="#181725" />
        </TouchableOpacity>

        {/* Header */}
        <Text className="text-heading font-bold text-textPrimary mb-2">Verify Phone</Text>
        <Text className="text-body text-textSecondary mb-8">
          Enter the 6-digit code sent to{' '}
          <Text className="font-bold text-textPrimary">+91 {phone}</Text>
        </Text>

        {/* OTP Inputs */}
        <View className="flex-row justify-between mb-8">
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={ref => inputRefs.current[i] = ref}
              className={`w-[48px] h-[56px] rounded-2xl text-center text-title font-bold border-2 ${digit ? 'border-[#1A6EB4] bg-[#F0F6FA]' : 'border-surfaceDark bg-white'} text-textPrimary`}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, i)}
              onKeyPress={(e) => handleKeyPress(e, i)}
            />
          ))}
        </View>

        {/* Resend */}
        <View className="flex-row items-center mb-8">
          <Ionicons name="time-outline" size={16} color="#B3B3B3" />
          <Text className="text-textSecondary text-body ml-1">Resend code in </Text>
          <Text className="text-[#1A6EB4] font-bold text-body">60s</Text>
        </View>

        {/* Error Message */}
        {error && <Text className="text-error text-center mb-4">{error}</Text>}

        {/* Spacer */}
        <View className="flex-1" />

        {/* Verify Button */}
        <TouchableOpacity
          className={`h-[56px] rounded-2xl items-center justify-center shadow-sm shadow-black/10 ${isComplete && !loading ? 'bg-[#1A6EB4]' : 'bg-[#B3B3B3]'}`}
          onPress={handleVerify}
          disabled={!isComplete || loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-body-md">Verify & Continue</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
