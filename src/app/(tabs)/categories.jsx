import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import dummyCategories from '../../data/dummyCategories.json';
import { useRouter } from 'expo-router';

export default function CategoriesScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background pt-12">
      <View className="px-screen pb-4 border-b border-surfaceDark mb-4 items-center">
        <Text className="text-title font-bold text-textPrimary">Find Products</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}>
        <View className="flex-row flex-wrap justify-between">
          {dummyCategories.map(cat => (
            <TouchableOpacity 
              key={cat.id} 
              className="w-[48%] h-40 rounded-card-lg items-center justify-center mb-4 border border-surfaceDark" 
              style={{ backgroundColor: cat.color }}
              onPress={() => router.push(`/(tabs)/products?category=${cat.id}`)}
            >
              <Text className="text-5xl mb-4">{cat.icon}</Text>
              <Text className="text-body font-bold text-textPrimary text-center px-2">{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
