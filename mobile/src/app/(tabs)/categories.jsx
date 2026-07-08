import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import dummyCategories from '../../data/dummyCategories.json';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function CategoriesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="px-4 py-4 border-b border-[#F2F3F2] flex-row items-center justify-between">
        <Text className="text-title font-bold text-textPrimary">All Categories</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color="#181725" />
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 100 }}>
        <View className="flex-row flex-wrap justify-between gap-y-6">
          {dummyCategories.map(cat => (
            <TouchableOpacity 
              key={cat.id} 
              className="w-[30%] items-center" 
              onPress={() => router.push(`/(tabs)/products?category=${cat.id}`)}
            >
              <View className="w-20 h-20 rounded-full bg-[#F0F6FA] items-center justify-center mb-3 overflow-hidden border border-[#E5E5E5] shadow-sm shadow-black/5">
                <Image source={{ uri: cat.image }} className="w-16 h-16 rounded-full" resizeMode="cover" />
              </View>
              <Text className="text-label font-semibold text-textPrimary text-center px-1" numberOfLines={2}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Gradient fade at bottom - Blinkit style */}
      <LinearGradient
        colors={['transparent', 'rgba(248,248,248,0.85)', '#F8F8F8']}
        locations={[0, 0.45, 1]}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120 }}
        pointerEvents="none"
      />
    </View>
  );
}
