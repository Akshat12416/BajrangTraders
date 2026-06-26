import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import dummyProducts from '../../data/dummyProducts.json';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCartStore } from '../../store/cartStore';

export default function ProductListScreen() {
  const { category } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { addItem, getItemQuantity, updateQuantity } = useCartStore();
  
  const filteredProducts = category 
    ? dummyProducts.filter(p => p.categoryId === category)
    : dummyProducts;

  const handleAddToCart = (prod) => {
    const qty = getItemQuantity(prod.id);
    if (qty === 0) {
      addItem(prod, 1);
    } else {
      updateQuantity(prod.id, qty + 1);
    }
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="px-4 py-4 border-b border-[#F2F3F2] flex-row items-center justify-between">
        <TouchableOpacity>
          <Ionicons name="filter-outline" size={24} color="#181725" />
        </TouchableOpacity>
        <Text className="text-title font-bold text-textPrimary">Products</Text>
        <TouchableOpacity>
          <Ionicons name="search-outline" size={24} color="#181725" />
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 }}>
        <View className="flex-row flex-wrap justify-between gap-y-4">
          {filteredProducts.map(prod => {
            const qty = getItemQuantity(prod.id);
            return (
              <TouchableOpacity 
                key={prod.id} 
                className="w-[48%] bg-white rounded-[20px] p-3 border border-surfaceDark shadow-sm shadow-black/5 relative"
                onPress={() => router.push({ pathname: '/product-detail', params: { productId: prod.id } })}
                activeOpacity={0.8}
              >
                {/* Top Badges */}
                <View className="flex-row justify-between z-10 absolute top-0 left-0 right-0 p-3">
                  <View className="bg-[#E6F3FA] px-1.5 py-0.5 rounded-sm">
                    <Text className="text-[#1A6EB4] text-[10px] font-bold">{prod.discountPercentage.split(' ')[0]}</Text>
                    <Text className="text-[#1A6EB4] text-[10px] font-bold">Off</Text>
                  </View>
                  <TouchableOpacity>
                    <Ionicons name="heart-outline" size={18} color="#B3B3B3" />
                  </TouchableOpacity>
                </View>

                {/* Image */}
                <Image source={{ uri: prod.image }} className="w-full h-[120px] mb-3 mt-4 rounded-lg" resizeMode="contain" />

                {/* Add Button */}
                <TouchableOpacity 
                  className="absolute bottom-[72px] right-3 w-8 h-8 bg-[#1A6EB4] rounded-full items-center justify-center z-10 shadow-sm shadow-black/10"
                  onPress={() => handleAddToCart(prod)}
                >
                  {qty > 0 ? (
                    <Text className="text-white text-label font-bold">{qty}</Text>
                  ) : (
                    <Ionicons name="add" size={20} color="#FFFFFF" />
                  )}
                </TouchableOpacity>

                {/* Price Info */}
                <Text className="text-[18px] font-bold text-[#E2523A] mb-0.5">₹{prod.discountPrice}</Text>
                <View className="flex-row items-center mb-1">
                  <Text className="text-[10px] text-textSecondary line-through mr-1">₹{prod.originalPrice}</Text>
                  <Text className="text-[10px] text-[#1A6EB4] font-bold">{prod.discountPercentage}</Text>
                </View>
                
                {/* Title & SKU */}
                <Text className="text-label text-textPrimary" numberOfLines={2}>{prod.name}</Text>
                <Text className="text-[10px] text-textSecondary mt-0.5">{prod.unit} • {prod.sku}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
