import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';
import { useCartStore } from '../../store/cartStore';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  // Subscribe to items array directly so badge re-renders
  const cartItems = useCartStore(state => state.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1A6EB4',
        tabBarInactiveTintColor: '#B3B3B3',
        tabBarShowLabel: false,
        tabBarStyle: { 
          position: 'absolute',
          bottom: insets.bottom + 16,
          left: 16,
          right: 16,
          height: 64, 
          borderRadius: 32,
          backgroundColor: '#FFFFFF', 
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="storefront-outline" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color }) => <Ionicons name="grid-outline" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color }) => (
            <View className="relative">
              <Ionicons name="basket-outline" size={26} color={color} />
              {cartCount > 0 && (
                <View className="absolute -top-1 -right-2 bg-error w-4 h-4 rounded-full items-center justify-center">
                  <Text className="text-[10px] text-white font-bold">{cartCount}</Text>
                </View>
              )}
            </View>
          )
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Products',
          tabBarIcon: ({ color }) => <Ionicons name="list-outline" size={24} color={color} />
        }}
      />
    </Tabs>
  );
}
