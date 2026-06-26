import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import dummyProducts from '../../data/dummyProducts.json';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

export default function ProductListScreen() {
  const { category } = useLocalSearchParams();
  
  const filteredProducts = category 
    ? dummyProducts.filter(p => p.categoryId === category)
    : dummyProducts;

  return (
    <View className="flex-1 bg-background pt-12">
      <View className="px-screen pb-4 border-b border-surfaceDark mb-4 flex-row items-center justify-between">
        <TouchableOpacity>
          <Ionicons name="filter-outline" size={24} color="#181725" />
        </TouchableOpacity>
        <Text className="text-title font-bold text-textPrimary">Products</Text>
        <TouchableOpacity>
          <Ionicons name="search-outline" size={24} color="#181725" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}>
        <View className="flex-row flex-wrap justify-between">
          {filteredProducts.map(prod => (
            <TouchableOpacity key={prod.id} className="w-[48%] h-[248px] bg-surface rounded-card-lg p-card mb-4 border border-surfaceDark">
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
        </View>
      </ScrollView>
    </View>
  );
}
