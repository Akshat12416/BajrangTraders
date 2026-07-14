import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useCartStore } from '../../store/cartStore';
import { useCatalogStore } from '../../store/catalogStore';

export default function ProductListScreen() {
  const { category } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const cartItems = useCartStore(state => state.items);
  const addItem = useCartStore(state => state.addItem);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  
  const { products: allProducts, loading, error, fetchCatalog } = useCatalogStore();
  
  // Filter locally based on the category param
  const products = category 
    ? allProducts.filter(p => p.categoryCode === category)
    : allProducts;

  useEffect(() => {
    if (allProducts.length === 0) {
      fetchCatalog();
    }
  }, []);

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
      <View className="px-4 py-4 border-b border-[#F2F3F2] flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#181725" />
        </TouchableOpacity>
        <Text className="text-title font-bold text-textPrimary">Products</Text>
        <TouchableOpacity>
          <Ionicons name="search-outline" size={24} color="#181725" />
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#181725" />
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-center text-textSecondary mb-4 text-label">{error}</Text>
          <TouchableOpacity 
            className="bg-[#1A6EB4] px-6 py-3 rounded-full"
            onPress={fetchCatalog}
          >
            <Text className="text-white font-bold">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 }}>
          <View className="flex-row flex-wrap justify-between gap-y-4">
            {products.map((prod, index) => {
              const qty = getItemQuantity(prod.id);
              return (
                <TouchableOpacity 
                  key={`${prod.id}-${index}`} 
                  className="w-[48%] bg-white rounded-[20px] p-3 border border-surfaceDark shadow-sm shadow-black/5 relative"
                  onPress={() => router.push({ pathname: '/product-detail', params: { productId: prod.id } })}
                  activeOpacity={0.8}
                >
                  {/* Top Badges */}
                  <View className="flex-row justify-between z-10 absolute top-0 left-0 right-0 p-3">
                    {prod.scheme ? (
                      <View className="bg-[#E6F3FA] px-1.5 py-0.5 rounded-sm max-w-[80%]">
                        <Text className="text-[#1A6EB4] text-[10px] font-bold" numberOfLines={1}>{prod.scheme}</Text>
                      </View>
                    ) : <View />}
                    <TouchableOpacity>
                      <Ionicons name="heart-outline" size={18} color="#B3B3B3" />
                    </TouchableOpacity>
                  </View>

                  {/* Image / Fallback Placeholder */}
                  {prod.image ? (
                    <Image source={{ uri: prod.image }} className="w-full h-[100px] mb-2 mt-4 rounded-lg" resizeMode="contain" />
                  ) : (
                    <View className="w-full h-[100px] mb-2 mt-4 rounded-lg bg-gray-100 items-center justify-center">
                       <Ionicons name="cube-outline" size={40} color="#B3B3B3" />
                    </View>
                  )}

                  {/* Title & SKU */}
                  <Text className="text-label text-textPrimary" numberOfLines={2}>{prod.name}</Text>
                  <Text className="text-[10px] text-textSecondary mt-0.5 mb-3">{prod.unit} • Stock: {prod.stock}</Text>

                  {/* Price & Controls */}
                  <View className="flex-row justify-between items-end mt-auto">
                    <View>
                      <Text className="text-[16px] font-bold text-[#E2523A]">₹{prod.pricePerPiece}</Text>
                      {prod.mrp > prod.pricePerPiece && (
                        <Text className="text-[10px] text-textSecondary line-through">₹{prod.mrp}</Text>
                      )}
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
          </View>
        </ScrollView>
      )}

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
