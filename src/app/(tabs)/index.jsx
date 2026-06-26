import { View, Text, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import dummyCategories from '../../data/dummyCategories.json';
import dummyProducts from '../../data/dummyProducts.json';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { phoneNumber } = useAuthStore();
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-screen pt-12 pb-4 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Ionicons name="location-outline" size={24} color="#181725" />
          <Text className="text-title-sm font-semibold text-textPrimary ml-2">Welcome</Text>
        </View>
        <Ionicons name="notifications-outline" size={24} color="#181725" />
      </View>

      <View className="px-screen mb-section">
        <View className="h-input bg-surface rounded-btn px-input flex-row items-center">
          <Ionicons name="search" size={20} color="#181725" />
          <TextInput
            className="flex-1 ml-2 text-body-md"
            placeholder="Search Store"
            placeholderTextColor="#B3B3B3"
          />
        </View>
      </View>

      <View className="px-screen mb-section">
        <View className="w-full h-32 bg-primaryLight rounded-card-lg items-center justify-center">
           <Text className="text-title font-bold text-primary">Fresh Groceries</Text>
        </View>
      </View>

      <View className="mb-section">
        <View className="px-screen flex-row justify-between items-center mb-4">
          <Text className="text-title font-bold text-textPrimary">Categories</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/categories')}>
            <Text className="text-body text-primary">See all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}>
          {dummyCategories.map(cat => (
            <TouchableOpacity key={cat.id} className="w-[100px] h-[100px] rounded-card items-center justify-center" style={{ backgroundColor: cat.color }}>
              <Text className="text-3xl mb-2">{cat.icon}</Text>
              <Text className="text-caption font-semibold text-textPrimary text-center px-1" numberOfLines={2}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View className="mb-section">
        <View className="px-screen flex-row justify-between items-center mb-4">
          <Text className="text-title font-bold text-textPrimary">Best Selling</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/products')}>
            <Text className="text-body text-primary">See all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}>
          {dummyProducts.map(prod => (
            <TouchableOpacity key={prod.id} className="w-[174px] h-[248px] bg-surface rounded-card-lg p-card">
              <Image source={{ uri: prod.image }} className="w-full h-24 mb-4 rounded-md" resizeMode="cover" />
              <Text className="text-body font-bold text-textPrimary mb-1" numberOfLines={1}>{prod.name}</Text>
              <Text className="text-caption text-textSecondary mb-2">{prod.unit}</Text>
              <View className="flex-row justify-between items-center mt-auto">
                <Text className="text-title-sm font-semibold text-textPrimary">₹{prod.pricePiece}</Text>
                <TouchableOpacity className="w-9 h-9 bg-primary rounded-btn items-center justify-center">
                  <Ionicons name="add" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}
