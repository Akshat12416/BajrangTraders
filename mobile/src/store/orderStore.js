import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useOrderStore = create(
  persist(
    (set, get) => ({
      pendingOrders: [],
      addOrder: (order) => set({ 
        pendingOrders: [order, ...get().pendingOrders] 
      }),
      removeOrder: (id) => set({ 
        pendingOrders: get().pendingOrders.filter(o => o.id !== id) 
      }),
      clearOrders: () => set({ pendingOrders: [] })
    }),
    {
      name: 'pending-orders-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
