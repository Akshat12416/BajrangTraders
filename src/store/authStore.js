import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  isLoggedIn: false,
  token: null,
  customerId: null,
  phoneNumber: null,
  login: (phone, token, customerId) => set({
    isLoggedIn: true,
    token,
    customerId,
    phoneNumber: phone
  }),
  logout: () => set({
    isLoggedIn: false,
    token: null,
    customerId: null,
    phoneNumber: null
  })
}));
