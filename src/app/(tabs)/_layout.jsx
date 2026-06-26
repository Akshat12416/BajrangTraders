import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#53B175',
        tabBarInactiveTintColor: '#181725',
        tabBarStyle: { height: 72, paddingBottom: 8, paddingTop: 8, backgroundColor: '#FFFFFF', borderTopColor: '#E2E2E2' },
        tabBarLabelStyle: { fontSize: 12 }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />
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
        name="products"
        options={{
          title: 'Products',
          tabBarIcon: ({ color }) => <Ionicons name="list-outline" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color }) => <Ionicons name="cart-outline" size={24} color={color} />
        }}
      />
    </Tabs>
  );
}
