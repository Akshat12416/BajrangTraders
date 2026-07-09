import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [],
  
  addItem: (product, quantity = 1) => set((state) => {
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

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + ((item.product.pricePerPiece || item.product.mrp || 0) * item.quantity), 0);
  },

  getItemQuantity: (productId) => {
    const item = get().items.find(i => i.productId === productId);
    return item ? item.quantity : 0;
  }
}));
