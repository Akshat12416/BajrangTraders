import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export default function SplashScreen() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoggedIn) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [isLoggedIn, router]);

  return (
    <View className="flex-1 bg-background justify-center items-center">
      <View className="w-24 h-24 bg-primaryLight rounded-full items-center justify-center mb-4">
        <Text className="text-4xl text-primary">🛒</Text>
      </View>
      <Text className="text-primary font-bold text-heading">GroceryApp</Text>
    </View>
  );
}
