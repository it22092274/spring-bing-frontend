import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cartItem } from "../interfaces/Product";
import { produce } from "immer";
import Product from "../interfaces/Product";

interface CartStore {
  user_id: string;
  cart: cartItem[];
  itemCount: number;
  totalPrice: number;
  addProductToCart: (product: Product) => void;
  removeProductFromCart: (productId: string) => void;
  increaseProductQuantity: (productId: string) => void;
  decreaseProductQuantity: (productId: string) => void;
  calculateTotal: () => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      user_id: "66d196a444e126395cbed7d4",
      cart: [],
      itemCount: 0,
      totalPrice: 0,

      addProductToCart: (product) =>
        set(
          produce((state: CartStore) => {
            const existingItemIndex = state.cart.findIndex(
              (item) => item.product._id === product._id
            );

            if (existingItemIndex > -1) {
              state.cart[existingItemIndex].quantity += 1;
            } else {
              state.cart.push({ product, quantity: 1 });
            }

            state.itemCount += 1;
          })
        ),

      removeProductFromCart: (productId) =>
        set(
          produce((state: CartStore) => {
            const existingItemIndex = state.cart.findIndex(
              (item) => item.product._id === productId
            );

            if (existingItemIndex > -1) {
              state.cart.splice(existingItemIndex, 1);
              state.itemCount -= 1;
            }
          })
        ),

      increaseProductQuantity: (productId) =>
        set(
          produce((state: CartStore) => {
            const existingItemIndex = state.cart.findIndex(
              (item) => item.product._id === productId
            );

            if (existingItemIndex > -1) {
              state.cart[existingItemIndex].quantity += 1;
              state.itemCount += 1;
            }
          })
        ),

      decreaseProductQuantity: (productId) =>
        set(
          produce((state: CartStore) => {
            const existingItemIndex = state.cart.findIndex(
              (item) => item.product._id === productId
            );

            if (existingItemIndex > -1) {
              if (state.cart[existingItemIndex].quantity > 1) {
                state.cart[existingItemIndex].quantity -= 1;
              } else {
                state.cart.splice(existingItemIndex, 1);
              }
              state.itemCount -= 1;
            }
          })
        ),

      calculateTotal: () =>
        set(
          produce((state: CartStore) => {
            state.totalPrice = state.cart.reduce((total, item) => {
              return total + item.product.unit_price * item.quantity;
            }, 0);
          })
        ),

      clearCart: () =>
        set(
          produce((state: CartStore) => {
            state.cart = [];
            state.itemCount = 0;
            state.totalPrice = 0;
          })
        ),
    }),
    {
      name: "cart-storage",
    }
  )
);
