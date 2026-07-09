import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useCartStore } from '../../store/cartStore';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { getCategories, getProductsByCategory } from '../../services/productService';
import { getCustomerProfile } from '../../services/customerService';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cartItems = useCartStore(state => state.items);
  const addItem = useCartStore(state => state.addItem);
  const updateQuantity = useCartStore(state => state.updateQuantity);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const custPromise = getCustomerProfile().catch(err => {
          console.warn("Failed to fetch customer profile on home screen", err);
          return null;
        });

        const [cats, prods, cust] = await Promise.all([
          getCategories(),
          getProductsByCategory(), // null category gets all products
          custPromise // fetches demo customer 6732867
        ]);
        setCategories(cats);
        setProducts(prods);
        setCustomer(cust);
      } catch (err) {
        setError("Failed to load data. Please check your connection.");
        console.error("Home API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

  if (loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#1A6EB4" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-6">
        <Text className="text-body text-textSecondary text-center mb-4">{error}</Text>
        <TouchableOpacity 
          className="bg-[#1A6EB4] px-6 py-2 rounded-full"
          onPress={() => {
            setLoading(true);
            setError(null);
            const custPromise = getCustomerProfile().catch(err => {
              console.warn("Failed to fetch customer profile on home screen", err);
              return null;
            });
            Promise.all([getCategories(), getProductsByCategory(), custPromise])
              .then(([cats, prods, cust]) => { setCategories(cats); setProducts(prods); setCustomer(cust); setLoading(false); })
              .catch(err => { setError("Still failing to connect. Please try again."); setLoading(false); });
          }}
        >
          <Text className="text-white font-bold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Filter products for Best Deals (those with a scheme) or just take the first 10
  const deals = products.filter(p => p.scheme).length > 0 
    ? products.filter(p => p.scheme).slice(0, 10)
    : products.slice(0, 10);

  const allProducts = products.slice(0, 20);

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Header */}
        <View className="px-4 py-4 flex-row justify-between items-center">
          <TouchableOpacity className="flex-row items-center border border-surfaceDark rounded-full px-3 py-1.5">
            <Ionicons name="location" size={16} color="#1A6EB4" />
            <Text className="text-label font-semibold text-textPrimary mx-1" numberOfLines={1}>
              {customer?.name ? customer.name.substring(0, 12) + '...' : 'Store 476CP...'}
            </Text>
          </TouchableOpacity>
          
          <View className="flex-row items-center flex-1 justify-center mx-2">
            <MaterialCommunityIcons name="moped" size={20} color="#E2523A" />
            <View className="ml-1">
              <Text className="text-[10px] text-textSecondary">Free delivery</Text>
              <Text className="text-label font-bold text-textPrimary">₹1000+ ⓘ</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            className="w-10 h-10 rounded-full bg-[#E6F3FA] items-center justify-center border border-[#E5E5E5]"
            onPress={() => router.push('/profile')}
          >
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

        {/* Outstanding Ledger Card */}
        <View className="px-4 mb-6">
          <TouchableOpacity 
            className="w-full bg-[#1A6EB4] rounded-[20px] p-5 shadow-sm shadow-black/10 flex-row justify-between items-center"
            onPress={() => router.push('/(tabs)/ledger')}
            activeOpacity={0.9}
          >
            <View>
              <Text className="text-white/80 text-label mb-1">Total Outstanding</Text>
              <Text className="text-white text-heading font-bold">
                ₹{customer?.outstandingBalance ? customer.outstandingBalance.toFixed(2) : '0.00'}
              </Text>
            </View>
            <View className="items-end">
              <View className="bg-white/20 px-3 py-1.5 rounded-full flex-row items-center">
                <Text className="text-white text-[10px] font-bold mr-1">View Ledger</Text>
                <Ionicons name="chevron-forward" size={12} color="white" />
              </View>
            </View>
          </TouchableOpacity>
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
            {categories.map((cat, index) => (
              <TouchableOpacity key={`${cat.code}-${index}`} className="items-center w-16" onPress={() => router.push(`/(tabs)/products?category=${cat.code}`)}>
                <View className="w-16 h-16 rounded-full bg-[#F0F6FA] items-center justify-center mb-2 overflow-hidden border border-[#E5E5E5]">
                  {cat.image ? (
                    <Image source={{ uri: cat.image }} className="w-12 h-12 rounded-full" resizeMode="cover" />
                  ) : (
                    <Ionicons name="folder-outline" size={24} color="#1A6EB4" />
                  )}
                </View>
                <Text className="text-label text-textPrimary text-center" numberOfLines={1}>{cat.name}</Text>
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
            {deals.map((prod, index) => {
              const qty = getItemQuantity(prod.id);
              return (
                <TouchableOpacity 
                  key={`deal-${prod.id}-${index}`} 
                  className="w-[160px] bg-white rounded-[20px] p-3 border border-surfaceDark shadow-sm shadow-black/5 relative"
                  onPress={() => router.push({ pathname: '/product-detail', params: { productId: prod.id } })}
                  activeOpacity={0.8}
                >
                  {/* Top Badges */}
                  <View className="flex-row justify-between z-10 absolute top-0 left-0 right-0 p-3">
                    {prod.scheme ? (
                      <View className="bg-[#E6F3FA] px-1.5 py-0.5 rounded-sm">
                        <Text className="text-[#1A6EB4] text-[10px] font-bold">Deal</Text>
                      </View>
                    ) : <View />}
                    <TouchableOpacity>
                      <Ionicons name="heart-outline" size={18} color="#B3B3B3" />
                    </TouchableOpacity>
                  </View>

                  {/* Image */}
                  {prod.image ? (
                    <Image source={{ uri: prod.image }} className="w-full h-[100px] mb-2 mt-4 rounded-lg" resizeMode="contain" />
                  ) : (
                    <View className="w-full h-[100px] mb-2 mt-4 rounded-lg bg-gray-100 items-center justify-center">
                       <Ionicons name="cube-outline" size={40} color="#B3B3B3" />
                    </View>
                  )}
                  
                  {/* Title */}
                  <Text className="text-label text-textPrimary" numberOfLines={2}>{prod.name}</Text>
                  <Text className="text-[10px] text-textSecondary mt-0.5 mb-3">{prod.unit}</Text>

                  {/* Price & Controls */}
                  <View className="flex-row justify-between items-end mt-auto">
                    <View>
                      <Text className="text-[16px] font-bold text-[#E2523A]">₹{prod.pricePerPiece || prod.mrp}</Text>
                      {prod.mrp && prod.pricePerPiece && prod.mrp > prod.pricePerPiece && (
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
          </ScrollView>
        </View>

        {/* All Products Grid */}
        <View className="px-4 mt-6">
          <Text className="text-title-sm font-bold text-textPrimary mb-4">All Products</Text>
          <View className="flex-row flex-wrap justify-between gap-y-4">
            {allProducts.map((prod, index) => {
              const qty = getItemQuantity(prod.id);
              return (
                <TouchableOpacity 
                  key={`all-${prod.id}-${index}`} 
                  className="w-[48%] bg-white rounded-[20px] p-3 border border-surfaceDark shadow-sm shadow-black/5 relative"
                  onPress={() => router.push({ pathname: '/product-detail', params: { productId: prod.id } })}
                  activeOpacity={0.8}
                >
                  {/* Top Badges */}
                  <View className="flex-row justify-between z-10 absolute top-0 left-0 right-0 p-3">
                    {prod.scheme ? (
                      <View className="bg-[#E6F3FA] px-1.5 py-0.5 rounded-sm max-w-[70%]">
                        <Text className="text-[#1A6EB4] text-[10px] font-bold text-center" numberOfLines={2}>
                          Deal: {prod.scheme}
                        </Text>
                      </View>
                    ) : <View />}
                    <TouchableOpacity>
                      <Ionicons name="heart-outline" size={18} color="#B3B3B3" />
                    </TouchableOpacity>
                  </View>

                  {/* Image */}
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
                      <Text className="text-[16px] font-bold text-[#E2523A]">₹{prod.pricePerPiece || prod.mrp}</Text>
                      {prod.mrp && prod.pricePerPiece && prod.mrp > prod.pricePerPiece && (
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
