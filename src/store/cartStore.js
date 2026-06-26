import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [],
  addItem: (product, quantity = 1, price) => set((state) => {
    const existingItem = state.items.find(item => item.productId === product.id);
    if (existingItem) {
      return {
        items: state.items.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      };
    }
    return {
      items: [...state.items, {
        productId: product.id,
        product,
        quantity,
        price
      }]
    };
  }),
  removeItem: (productId) => set((state) => ({
    items: state.items.filter(item => item.productId !== productId)
  })),
  updateQuantity: (productId, quantity) => set((state) => {
    if (quantity <= 0) {
      return { items: state.items.filter(item => item.productId !== productId) };
    }
    return {
      items: state.items.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    };
  }),
  clearCart: () => set({ items: [] }),
  get totalItems() {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
  get totalPrice() {
    return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}));
