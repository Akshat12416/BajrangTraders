import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getCategories } from '../../services/productService';

export default function CategoriesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="px-4 py-4 border-b border-[#F2F3F2] flex-row items-center justify-between">
        <Text className="text-title font-bold text-textPrimary">All Categories</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color="#181725" />
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
            onPress={fetchCategories}
          >
            <Text className="text-white font-bold">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 100 }}>
          <View className="flex-row flex-wrap justify-between gap-y-6">
            {categories.map((cat, i) => (
              <TouchableOpacity 
                key={cat.code || i} 
                className="w-[30%] items-center" 
                onPress={() => router.push(`/(tabs)/products?category=${cat.code}`)}
              >
                <View className="w-20 h-20 rounded-full bg-[#F0F6FA] items-center justify-center mb-3 overflow-hidden border border-[#E5E5E5] shadow-sm shadow-black/5">
                  <Ionicons name="grid" size={32} color="#1A6EB4" />
                </View>
                <Text className="text-label font-semibold text-textPrimary text-center px-1" numberOfLines={2}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
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
