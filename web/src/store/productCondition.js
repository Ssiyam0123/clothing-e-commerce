import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import api from "@/lib/api";
import { swalToast } from "@/utils/swal";

const initialState = {
  cart: { items: [], totalItems: 0, totalPrice: 0 },
  wishlistItems: [],
};

const calculateCartTotals = (items) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.discountedPrice * item.quantity,
    0
  );
  return { totalItems, totalPrice };
};

export const useProductCondition = create(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        fetchInitialData: async () => {
          try {
            const [cartRes, wishlistRes] = await Promise.all([
              api.get("/cart"),
              api.get("/wishlist"),
            ]);
            set({
              cart: cartRes.data || { items: [], totalItems: 0, totalPrice: 0 },
              wishlistItems: wishlistRes.data?.products || [],
            });
          } catch (err) {
            console.error("Initial fetch error:", err);
          }
        },

        // 🛒 Add to Cart (Optimistic)
        addToCart: (product, sizeId, quantity = 1, isAuthenticated = false) => {
          const previousCart = get().cart;
          const discountedPrice = product.price - (product.price * (product.discount || 0)) / 100;

          set((state) => {
            const items = [...state.cart.items];
            const existingIndex = items.findIndex(
              (i) => String(i.product._id) === String(product._id) && String(i.size._id) === String(sizeId)
            );
            if (existingIndex > -1) {
              items[existingIndex] = { ...items[existingIndex], quantity: items[existingIndex].quantity + quantity };
            } else {
              items.push({
                product: { ...product },
                size: { _id: sizeId, name: product.sizes?.find((s) => String(s.size._id) === String(sizeId))?.size?.name || "Standard" },
                quantity,
                discountedPrice,
                originalPrice: product.price,
              });
            }
            return { cart: { items, ...calculateCartTotals(items) } };
          });

          if (isAuthenticated) {
            api.post("/cart/add", { productId: product._id, sizeId, quantity }).catch(() => {
              set({ cart: previousCart });
              swalToast("Cart sync failed", "error");
            });
          }
        },

        // ❤️ Toggle Wishlist (PURE OPTIMISTIC - 1ms response)
        toggleWishlist: (product, isAuthenticated = false) => {
          const previousItems = get().wishlistItems;
          const productId = String(product._id);
          const isExist = previousItems.some((p) => String(p._id) === productId);

          // ১. সাথে সাথে স্টেট আপডেট (UI সরাসরি চেঞ্জ হবে)
          set((state) => ({
            wishlistItems: isExist
              ? state.wishlistItems.filter((p) => String(p._id) !== productId)
              : [...state.wishlistItems, product],
          }));

          // ২. ব্যাকগ্রাউন্ড সিঙ্ক (No await - ইউজার ইন্টারফেস আটকাবে না)
          if (isAuthenticated) {
            const sync = isExist
              ? api.delete(`/wishlist/remove/${productId}`)
              : api.post("/wishlist/add", { productId: productId });

            sync.catch(() => {
              // এরর হলে রোলব্যাক
              set({ wishlistItems: previousItems });
              swalToast("Sync Failed", "error");
            });
          }
        },

        removeFromCart: async (productId, sizeId, isAuthenticated = false) => {
          const previousCart = get().cart;
          set((state) => {
            const items = state.cart.items.filter(
              (i) => !(String(i.product._id) === String(productId) && String(i.size._id) === String(sizeId))
            );
            return { cart: { items, ...calculateCartTotals(items) } };
          });
          if (isAuthenticated) {
            api.delete(`/cart/remove/${productId}/${sizeId}`).catch(() => set({ cart: previousCart }));
          }
        },

        updateCartItem: async (productId, sizeId, newQuantity, isAuthenticated = false) => {
          const previousCart = get().cart;
          set((state) => {
            const items = state.cart.items.map((item) =>
              String(item.product._id) === String(productId) && String(item.size._id) === String(sizeId)
                ? { ...item, quantity: newQuantity }
                : item
            );
            return { cart: { items, ...calculateCartTotals(items) } };
          });
          if (isAuthenticated) {
            api.put("/cart/update", { productId, sizeId, quantity: newQuantity }).catch(() => set({ cart: previousCart }));
          }
        },

        resetStore: () => set(initialState),
      }),
      { name: "vanguard-condition-vault" }
    )
  )
);