import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export default function IndexRedirect() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/(tabs)');
    } else {
      router.replace('/(auth)/login');
    }
  }, [isLoggedIn, router]);

  return <View className="flex-1 bg-background" />;
}
