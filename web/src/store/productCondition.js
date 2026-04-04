import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import api from "@/lib/api";

const initialState = {
  cart: { items: [], totalItems: 0, totalPrice: 0 },
  wishlistItems: [],
  buyNowItem: null,
};

const calculateCartTotals = (items) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.discountedPrice * item.quantity),
    0
  );
  return { totalItems, totalPrice };
};

export const useProductCondition = create(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // --- Fetch fresh data from server (after login) ---
        fetchCartFromServer: async () => {
          try {
            const { data } = await api.get("/cart");
            set({ cart: data });
          } catch (err) {
            console.error("Failed to fetch cart:", err);
          }
        },

        fetchWishlistFromServer: async () => {
          try {
            const { data } = await api.get("/wishlist");
            set({ wishlistItems: data?.products || [] });
          } catch (err) {
            console.error("Failed to fetch wishlist:", err);
          }
        },

        // --- Merge guest data into user account and clear guest data ---
        syncGuestDataWithUser: async () => {
          const guestCart = get().cart;
          const guestWishlist = get().wishlistItems;

          // 1. Merge cart items
          if (guestCart.items && guestCart.items.length > 0) {
            for (const item of guestCart.items) {
              try {
                await api.post("/cart/add", {
                  productId: item.product._id,
                  sizeId: item.size._id,
                  quantity: item.quantity,
                });
              } catch (err) {
                console.error("Failed to sync cart item:", item, err);
              }
            }
          }

          // 2. Merge wishlist items
          if (guestWishlist.length > 0) {
            for (const product of guestWishlist) {
              try {
                await api.post("/wishlist/add", { productId: product._id });
              } catch (err) {
                console.error("Failed to sync wishlist item:", product, err);
              }
            }
          }

          // 3. Clear guest data from store and localStorage
          set(initialState);
          // Also force clear the persisted storage (already cleared via set)
          localStorage.removeItem("vanguard-condition-vault");

          // 4. Fetch fresh user data from server
          await get().fetchCartFromServer();
          await get().fetchWishlistFromServer();
        },

        // --- Standard cart/wishlist actions (unchanged) ---
        addToCart: (product, sizeId, quantity = 1, isAuthenticated = false) => {
          const previousCart = get().cart;
          set((state) => {
            const items = [...state.cart.items];
            const existingIndex = items.findIndex(
              (i) => String(i.product._id) === String(product._id) && String(i.size._id) === String(sizeId)
            );
            const discountedPrice = product.price - (product.price * (product.discount || 0)) / 100;
            if (existingIndex > -1) {
              items[existingIndex] = { ...items[existingIndex], quantity: items[existingIndex].quantity + quantity };
            } else {
              items.push({
                product,
                size: product.sizes?.find(s => String(s.size?._id || s.size) === String(sizeId))?.size || { _id: sizeId, name: "Standard" },
                quantity,
                discountedPrice,
                originalPrice: product.price
              });
            }
            return { cart: { items, ...calculateCartTotals(items) } };
          });

          if (isAuthenticated) {
            api.post("/cart/add", { productId: product._id, sizeId, quantity })
              .catch(() => set({ cart: previousCart }));
          }
        },

        initiateBuyNow: (product, sizeId, quantity = 1) => {
          const discountedPrice = product.price - (product.price * (product.discount || 0)) / 100;
          const sizeObj = product.sizes?.find(s => String(s.size?._id || s.size) === String(sizeId))?.size || { _id: sizeId, name: "Standard" };
          set({ buyNowItem: { product, size: sizeObj, quantity, discountedPrice, originalPrice: product.price } });
        },

        toggleWishlist: (product, isAuthenticated = false) => {
          const previousItems = get().wishlistItems;
          const productId = String(product._id);
          const isExist = previousItems.some((p) => String(p._id) === productId);

          set((state) => ({
            wishlistItems: isExist
              ? state.wishlistItems.filter((p) => String(p._id) !== productId)
              : [...state.wishlistItems, product],
          }));

          if (isAuthenticated) {
            const syncRequest = isExist
              ? api.delete(`/wishlist/remove/${productId}`)
              : api.post("/wishlist/add", { productId });
            syncRequest.catch(() => set({ wishlistItems: previousItems }));
          }
        },

        clearCart: () => set({ cart: { items: [], totalItems: 0, totalPrice: 0 }, buyNowItem: null }),

        removeFromCart: (productId, sizeId, isAuthenticated = false) => {
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

        updateCartItem: (productId, sizeId, newQuantity, isAuthenticated = false) => {
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
      {
        name: "vanguard-condition-vault",
        storage: {
          getItem: (name) => {
            const str = localStorage.getItem(name);
            return str ? JSON.parse(str) : null;
          },
          setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
          removeItem: (name) => localStorage.removeItem(name),
        }
      }
    )
  )
);