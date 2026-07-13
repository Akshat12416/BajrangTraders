import { create } from 'zustand';

export const useAuthStore = create((set) => ({
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
}));
