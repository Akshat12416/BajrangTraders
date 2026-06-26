import { View, Text, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useCartStore } from '../../store/cartStore';
import dummyCategories from '../../data/dummyCategories.json';
import dummyProducts from '../../data/dummyProducts.json';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  // Subscribe to items directly so we re-render when cart changes
  const cartItems = useCartStore(state => state.items);
  const addItem = useCartStore(state => state.addItem);
  const updateQuantity = useCartStore(state => state.updateQuantity);

  const getItemQuantity = (productId) => {
    const item = cartItems.find(i => i.productId === productId);
    return item ? item.quantity : 0;
  };

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
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Header */}
        <View className="px-4 py-4 flex-row justify-between items-center">
          <TouchableOpacity className="flex-row items-center border border-surfaceDark rounded-full px-3 py-1.5">
            <Ionicons name="location" size={16} color="#1A6EB4" />
            <Text className="text-label font-semibold text-textPrimary mx-1" numberOfLines={1}>Store 476CP...</Text>
          </TouchableOpacity>
          
          <View className="flex-row items-center flex-1 justify-center mx-2">
            <MaterialCommunityIcons name="moped" size={20} color="#E2523A" />
            <View className="ml-1">
              <Text className="text-[10px] text-textSecondary">Free delivery</Text>
              <Text className="text-label font-bold text-textPrimary">₹1000+ ⓘ</Text>
            </View>
          </View>
          
          <TouchableOpacity className="w-10 h-10 rounded-full bg-[#E6F3FA] items-center justify-center border border-[#E5E5E5]">
            <Ionicons name="person" size={20} color="#1A6EB4" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="px-4 mb-4">
          <View className="h-[48px] bg-white border border-surfaceDark rounded-full px-4 flex-row items-center shadow-sm shadow-black/5">
            <Ionicons name="search" size={20} color="#1A6EB4" />
            <TextInput
              className="flex-1 mx-2 text-body"
              placeholder="Search products, SKU, brands..."
              placeholderTextColor="#B3B3B3"
            />
          </View>
        </View>

        {/* Banner */}
        <View className="px-4 mb-6">
          <View className="w-full h-32 bg-[#1A6EB4] rounded-[20px] overflow-hidden relative">
            <View className="p-5 z-10 w-2/3">
              <Text className="text-white text-label mb-1 opacity-90">Shop wholesale</Text>
              <Text className="text-white text-heading font-bold mb-2">Pay Later !</Text>
              <View className="bg-[#4DB4FA] self-start px-2 py-0.5 rounded-full">
                <Text className="text-white text-[10px] font-bold">BULK ORDER</Text>
              </View>
            </View>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1588612502694-82a1dd0516fb?w=500' }} 
              className="absolute right-0 top-0 bottom-0 w-1/2 opacity-80"
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Categories */}
        <View className="mb-6">
          <View className="px-4 flex-row justify-between items-center mb-4">
            <Text className="text-title-sm font-bold text-textPrimary">Categories 📦</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/categories')}>
              <Text className="text-body text-[#1A6EB4] font-semibold">See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}>
            {dummyCategories.map(cat => (
              <TouchableOpacity key={cat.id} className="items-center w-16" onPress={() => router.push(`/(tabs)/products?category=${cat.id}`)}>
                <View className="w-16 h-16 rounded-full bg-[#F0F6FA] items-center justify-center mb-2 overflow-hidden border border-[#E5E5E5]">
                  <Image source={{ uri: cat.image }} className="w-12 h-12 rounded-full" resizeMode="cover" />
                </View>
                <Text className="text-label text-textPrimary text-center" numberOfLines={1}>{cat.name.split(' ')[0]}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Best Deals */}
        <View className="mb-6">
          <View className="px-4 flex-row justify-between items-center mb-4">
            <Text className="text-title-sm font-bold text-textPrimary">Best deals 🔥</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/products')}>
              <Text className="text-body text-[#1A6EB4] font-semibold">See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}>
            {dummyProducts.map(prod => {
              const qty = getItemQuantity(prod.id);
              return (
                <TouchableOpacity 
                  key={prod.id} 
                  className="w-[160px] bg-white rounded-[20px] p-3 border border-surfaceDark shadow-sm shadow-black/5 relative"
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
                  <Image source={{ uri: prod.image }} className="w-full h-[100px] mb-2 mt-4 rounded-lg" resizeMode="contain" />
                  
                  {/* Title */}
                  <Text className="text-label text-textPrimary" numberOfLines={2}>{prod.name}</Text>
                  <Text className="text-[10px] text-textSecondary mt-0.5 mb-3">{prod.unit}</Text>

                  {/* Price & Controls */}
                  <View className="flex-row justify-between items-end mt-auto">
                    <View>
                      <Text className="text-[16px] font-bold text-[#E2523A]">₹{prod.discountPrice}</Text>
                      <Text className="text-[10px] text-textSecondary line-through">₹{prod.originalPrice}</Text>
                    </View>

                    {qty > 0 ? (
                      <View className="flex-row items-center bg-[#1A6EB4] rounded-lg h-8 shadow-sm shadow-black/10">
                        <TouchableOpacity 
                          className="w-7 h-full items-center justify-center"
                          onPress={(e) => { e.stopPropagation(); updateQuantity(prod.id, qty - 1); }}
                        >
                          <Ionicons name="remove" size={16} color="white" />
                        </TouchableOpacity>
                        <Text className="text-white text-label font-bold min-w-[16px] text-center">{qty}</Text>
                        <TouchableOpacity 
                          className="w-7 h-full items-center justify-center"
                          onPress={(e) => { e.stopPropagation(); handleAddToCart(prod); }}
                        >
                          <Ionicons name="add" size={16} color="white" />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity 
                        className="w-8 h-8 bg-[#1A6EB4] rounded-lg items-center justify-center shadow-sm shadow-black/10"
                        onPress={(e) => { e.stopPropagation(); handleAddToCart(prod); }}
                      >
                        <Ionicons name="add" size={20} color="#FFFFFF" />
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

      </ScrollView>
    </View>
  );
}
