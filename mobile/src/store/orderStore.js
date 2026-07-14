import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useOrderStore = create(
  persist(
    (set, get) => ({
      pendingOrders: [],
      billedOrders: [],
      addOrder: (order) => set({ 
        pendingOrders: [order, ...get().pendingOrders] 
      }),
      removeOrder: (id) => set({ 
        pendingOrders: get().pendingOrders.filter(o => o.id !== id) 
      }),
      setBilledOrders: (orders) => set({ billedOrders: orders }),
      clearOrders: () => set({ pendingOrders: [], billedOrders: [] })
    }),
    {
      name: 'pending-orders-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ pendingOrders: state.pendingOrders }), // Don't persist billed orders
    }
  )
);
