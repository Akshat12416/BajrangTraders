import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProductsByCategory, getCategories } from '../services/productService';

export const useCatalogStore = create(
  persist(
    (set, get) => ({
      products: [],
      categories: [],
      lastSynced: null,
      loading: false,
      error: null,

      fetchCatalog: async () => {
        // If we already have data, we'll fetch in background without showing loading state
        const hasData = get().products.length > 0;
        if (!hasData) set({ loading: true, error: null });
        
        try {
          const [productsData, categoriesData] = await Promise.all([
            getProductsByCategory(),
            getCategories()
          ]);
          
          set({ 
            products: productsData, 
            categories: categoriesData,
            lastSynced: new Date().toISOString(),
            loading: false,
            error: null
          });
        } catch (err) {
          console.error("Failed to fetch catalog", err);
          if (!hasData) {
            set({ error: err.message || 'Failed to sync catalog', loading: false });
          }
        }
      }
    }),
    {
      name: 'catalog-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
