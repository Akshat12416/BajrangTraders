import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export default function IndexRedirect() {
  const router = useRouter();
  const { isLoggedIn, _hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!_hasHydrated) return;

    if (isLoggedIn) {
      router.replace('/(tabs)');
    } else {
      router.replace('/(auth)/login');
    }
  }, [isLoggedIn, _hasHydrated, router]);

  return <View className="flex-1 bg-background" />;
}
