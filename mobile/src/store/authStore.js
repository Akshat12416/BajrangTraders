import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      token: null,
      customer: null,
      login: (token, customer) => set({
        isLoggedIn: true,
        token,
        customer,
      }),
      logout: () => set({
        isLoggedIn: false,
        token: null,
        customer: null,
      })
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
