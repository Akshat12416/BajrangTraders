import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, Platform } from 'react-native';
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
        tabBarItemStyle: {
          paddingVertical: 0,
          marginTop: 10,
        },
        tabBarStyle: { 
          position: 'absolute',
          bottom: Platform.OS === 'android' ? 12 : insets.bottom + 16,
          left: 16,
          right: 16,
          height: 64, 
          borderRadius: 32,
          backgroundColor: '#FFFFFF', 
          borderTopWidth: 0,
          paddingTop: 0,
          paddingBottom: 0,
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
              <Ionicons name="cart-outline" size={26} color={color} />
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
        name="ledger"
        options={{
          title: 'Ledger',
          tabBarIcon: ({ color }) => <Ionicons name="receipt-outline" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color }) => <Ionicons name="cube-outline" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
          tabBarItemStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          href: null,
          tabBarItemStyle: { display: 'none' },
        }}
      />
    </Tabs>
  );
}
