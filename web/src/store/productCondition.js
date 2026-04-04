import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import api from "@/lib/api";

// ১. ইনিশিয়াল স্টেট ডিফাইন করা (Cleanup এর জন্য সুবিধা হয়)
const initialState = {
  cart: { items: [], totalItems: 0, totalPrice: 0 },
  wishlistItems: [],
  buyNowItem: null,
};

// ২. ক্যালকুলেশন হেল্পার (কোড ডুপ্লিকেশন কমানোর জন্য)
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

        // 🛒 ৩. Add to Cart (Optimistic UI + Backend Sync)
        addToCart: (product, sizeId, quantity = 1, isAuthenticated = false) => {
          const previousCart = get().cart;
          
          set((state) => {
            const items = [...state.cart.items];
            const existingIndex = items.findIndex(
              (i) => String(i.product._id) === String(product._id) && String(i.size._id) === String(sizeId)
            );
            
            const discountedPrice = product.price - (product.price * (product.discount || 0)) / 100;
            
            if (existingIndex > -1) {
              items[existingIndex] = { 
                ...items[existingIndex], 
                quantity: items[existingIndex].quantity + quantity 
              };
            } else {
              items.push({
                product,
                // সাইজ অবজেক্ট পপুলেট করার চেষ্টা করা হচ্ছে
                size: product.sizes?.find(s => String(s.size?._id || s.size) === String(sizeId))?.size || { _id: sizeId, name: "Standard" },
                quantity,
                discountedPrice,
                originalPrice: product.price
              });
            }
            
            return { cart: { items, ...calculateCartTotals(items) } };
          });

          // ইউজার লগইন করা থাকলে ব্যাকএন্ডের সাথে সিঙ্ক হবে
          if (isAuthenticated) {
            api.post("/cart/add", { productId: product._id, sizeId, quantity })
              .catch(() => {
                set({ cart: previousCart }); // ফেইল করলে রোলব্যাক
              });
          }
        },

        // ⚡ ৪. Initiate Buy Now (Direct Checkout এর জন্য)
        initiateBuyNow: (product, sizeId, quantity = 1) => {
          const discountedPrice = product.price - (product.price * (product.discount || 0)) / 100;
          const sizeObj = product.sizes?.find(s => String(s.size?._id || s.size) === String(sizeId))?.size || { _id: sizeId, name: "Standard" };
          
          set({ 
            buyNowItem: { 
              product, 
              size: sizeObj, 
              quantity, 
              discountedPrice,
              originalPrice: product.price 
            } 
          });
        },

        // ❤️ ৫. Toggle Wishlist (Pure Optimistic)
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
              : api.post("/wishlist/add", { productId: productId });

            syncRequest.catch(() => {
              set({ wishlistItems: previousItems }); // সিঙ্ক এরর হলে আগের অবস্থায় ফিরে যাবে
            });
          }
        },

        // 🧹 ৬. কার্ট ক্লিয়ার লজিক (পেমেন্ট সাকসেস হওয়ার পর কল দিবি)
        clearCart: () => set({ 
          cart: { items: [], totalItems: 0, totalPrice: 0 },
          buyNowItem: null 
        }),

        // 🔄 ৭. কার্ট থেকে আইটেম রিমুভ (ব্যাগ পেজের জন্য)
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

        // ➕ ৮. কোয়ান্টিটি আপডেট
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

        // 🛑 ৯. রিসেট স্টোর
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