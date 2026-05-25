import { create } from "zustand";

// ─── Type générique — couvre les deux apps ───────────────────────────────────
// linkAgri : id number, emoji/emojiColor/cultivateur/localite/unit
// JULISHOP : id string, imageUri/rating/reviewCount/discount

export type CartItem = {
  id: string | number;        // string pour JULISHOP, number pour linkAgri
  name: string;
  price: number;
  unit?: string;              // linkAgri
  qty: number;

  // linkAgri   
  emoji?: string;
  emojiColor?: string;
  cultivateur?: string;
  localite?: string;

  // JULISHOP
  imageUri?: string;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  reviewCount?: number;
};

// Type produit sans qty (pour add())
export type ProductInput = Omit<CartItem, "qty">;

type CartStore = {
  cart: Record<string, CartItem>;   // clé = String(id) dans tous les cas

  add:    (product: ProductInput) => void;
  inc:    (id: string | number) => void;
  dec:    (id: string | number) => void;
  remove: (id: string | number) => void;
  clear:  () => void;

  totalItems: () => number;
  totalPrice: () => number;
};

// helper : normalise l'id en string pour la clé du Record
const key = (id: string | number) => String(id);

export const useCartStore = create<CartStore>((set, get) => ({
  cart: {},

  add: (product) =>
    set((s) => {
      const k = key(product.id);
      return {
        cart: {
          ...s.cart,
          [k]: s.cart[k]
            ? { ...s.cart[k], qty: s.cart[k].qty + 1 }
            : { ...product, qty: 1 },
        },
      };
    }),

  inc: (id) =>
    set((s) => {
      const k = key(id);
      return {
        cart: { ...s.cart, [k]: { ...s.cart[k], qty: s.cart[k].qty + 1 } },
      };
    }),

  dec: (id) =>
    set((s) => {
      const k = key(id);
      const next = { ...s.cart };
      next[k] = { ...next[k], qty: next[k].qty - 1 };
      if (next[k].qty <= 0) delete next[k];
      return { cart: next };
    }),

  remove: (id) =>
    set((s) => {
      const next = { ...s.cart };
      delete next[key(id)];
      return { cart: next };
    }),

  clear: () => set({ cart: {} }),

  totalItems: () =>
    Object.values(get().cart).reduce((s, i) => s + i.qty, 0),

  totalPrice: () =>
    Object.values(get().cart).reduce((s, i) => s + i.price * i.qty, 0),
}));