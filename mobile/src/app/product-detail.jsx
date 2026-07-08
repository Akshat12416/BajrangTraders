import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCartStore } from '../store/cartStore';
import dummyProducts from '../data/dummyProducts.json';
import dummyCategories from '../data/dummyCategories.json';

export default function ProductDetailScreen() {
  const { productId } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // Subscribe directly to items for reactivity
  const cartItems = useCartStore(state => state.items);
  const addItem = useCartStore(state => state.addItem);
  const updateQuantity = useCartStore(state => state.updateQuantity);

  const product = dummyProducts.find(p => p.id === productId);
  if (!product) return null;

  const category = dummyCategories.find(c => c.id === product.categoryId);
  
  const itemInCart = cartItems.find(i => i.productId === product.id);
  const qty = itemInCart ? itemInCart.quantity : 0;

  const handleAddToCart = () => {
    if (qty === 0) {
      addItem(product, 1);
    } else {
      updateQuantity(product.id, qty + 1);
    }
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-4 py-3 flex-row items-center justify-between">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="w-10 h-10 rounded-full bg-[#F2F3F2] items-center justify-center"
        >
          <Ionicons name="chevron-back" size={20} color="#181725" />
        </TouchableOpacity>
        <TouchableOpacity className="w-10 h-10 rounded-full bg-[#F2F3F2] items-center justify-center">
          <Ionicons name="share-outline" size={20} color="#181725" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Product Image */}
        <View className="bg-[#F8F9FB] mx-4 rounded-[24px] p-8 items-center mb-6">
          <Image 
            source={{ uri: product.image }} 
            className="w-full h-[200px]" 
            resizeMode="contain" 
          />
        </View>

        {/* Product Info */}
        <View className="px-6">
          {/* Name & Favourite */}
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1 mr-4">
              <Text className="text-title font-bold text-textPrimary">{product.name}</Text>
              <Text className="text-body text-textSecondary mt-1">{product.unit}</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="heart-outline" size={24} color="#B3B3B3" />
            </TouchableOpacity>
          </View>

          {/* Price */}
          <View className="flex-row items-center mt-3 mb-6">
            <Text className="text-heading font-bold text-[#E2523A] mr-3">₹{product.discountPrice}</Text>
            <Text className="text-body text-textSecondary line-through mr-2">₹{product.originalPrice}</Text>
            <View className="bg-[#E6F3FA] px-2 py-0.5 rounded-full">
              <Text className="text-[#1A6EB4] text-label font-bold">{product.discountPercentage}</Text>
            </View>
          </View>

          {/* Divider */}
          <View className="h-px bg-[#F2F3F2] mb-4" />

          {/* Details Grid */}
          <Text className="text-title-sm font-bold text-textPrimary mb-4">Product Details</Text>
          
          <View className="flex-row flex-wrap gap-y-4 mb-6">
            <View className="w-1/2">
              <Text className="text-label text-textSecondary">SKU</Text>
              <Text className="text-body font-semibold text-textPrimary">{product.sku}</Text>
            </View>
            <View className="w-1/2">
              <Text className="text-label text-textSecondary">Company</Text>
              <Text className="text-body font-semibold text-textPrimary">{product.company}</Text>
            </View>
            <View className="w-1/2">
              <Text className="text-label text-textSecondary">Category</Text>
              <Text className="text-body font-semibold text-textPrimary">{category?.name || 'N/A'}</Text>
            </View>
            <View className="w-1/2">
              <Text className="text-label text-textSecondary">Availability</Text>
              <Text className={`text-body font-semibold ${product.inStock ? 'text-success' : 'text-error'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View className="h-px bg-[#F2F3F2] mb-4" />

          {/* Description */}
          <Text className="text-title-sm font-bold text-textPrimary mb-2">Description</Text>
          <Text className="text-body text-textSecondary leading-6">
            Premium quality {product.name} from {product.company}. Packaged as {product.unit} for wholesale distribution. 
            Ideal for retail shops and general stores. Bulk pricing available with additional discounts on repeat orders.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#F2F3F2] px-6 pt-3" style={{ paddingBottom: insets.bottom + 16 }}>
        {qty > 0 ? (
          <View className="flex-row items-center justify-between">
            {/* Quantity Controls */}
            <View className="flex-row items-center bg-[#F2F3F2] rounded-full">
              <TouchableOpacity 
                onPress={() => updateQuantity(product.id, qty - 1)}
                className="w-10 h-10 items-center justify-center"
              >
                <Ionicons name="remove" size={20} color="#1A6EB4" />
              </TouchableOpacity>
              <Text className="text-body-md font-bold text-textPrimary mx-3">{qty}</Text>
              <TouchableOpacity 
                onPress={() => updateQuantity(product.id, qty + 1)}
                className="w-10 h-10 items-center justify-center"
              >
                <Ionicons name="add" size={20} color="#1A6EB4" />
              </TouchableOpacity>
            </View>
            {/* Total */}
            <View className="flex-1 ml-4 bg-[#1A6EB4] rounded-full py-3.5 items-center shadow-sm shadow-black/10">
              <Text className="text-white font-bold text-body-md">₹{product.discountPrice * qty} Added</Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity 
            className="bg-[#1A6EB4] rounded-full py-4 items-center shadow-sm shadow-black/10"
            onPress={handleAddToCart}
          >
            <Text className="text-white font-bold text-body-md">Add to Cart — ₹{product.discountPrice}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
