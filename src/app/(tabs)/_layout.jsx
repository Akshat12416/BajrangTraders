import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#53B175',
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
              <View className="absolute -top-1 -right-2 bg-error w-4 h-4 rounded-full items-center justify-center">
                <Text className="text-[10px] text-white font-bold">4</Text>
              </View>
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
