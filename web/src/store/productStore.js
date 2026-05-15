import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import api from "@/lib/api";

const initialState = {
  cart: {
    itemsMap: {},
    totalItems: 0,
    totalPrice: 0,
  },
  wishlistSet: new Set(),
  wishlistItems: [],
  buyNowItem: null,
};

const getKey = (pId, sId) => `${String(pId)}_${String(sId)}`;
const getSafeId = (obj) =>
  obj && typeof obj === "object" ? String(obj._id || obj.id) : String(obj);

export const useProductStore = create(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        syncWithServer: async () => {
          try {
            const [cartRes, wishRes] = await Promise.all([
              api.get("/cart"),
              api.get("/wishlist"),
            ]);

            const itemsMap = {};
            let totalItems = 0;
            let totalPrice = 0;

            cartRes.data.items?.forEach((item, index) => {
              const key = getKey(getSafeId(item.product), getSafeId(item.size));

              const productPrice = Number(item.product?.price || 0);
              const productDiscount = Number(item.product?.discount || 0);

              const safeDiscountedPrice =
                Number(item.discountedPrice) ||
                productPrice - (productPrice * productDiscount) / 100;

              itemsMap[key] = {
                ...item,
                discountedPrice: safeDiscountedPrice,
                price: productPrice,
                createdAt: item.createdAt || (Date.now() + index),
              };

              totalItems += Number(item.quantity || 0);
              totalPrice += safeDiscountedPrice * Number(item.quantity || 0);
            });

            set({
              cart: {
                itemsMap,
                totalItems,
                totalPrice: Number(totalPrice.toFixed(2)),
              },
              wishlistSet: new Set(
                wishRes.data.products?.map((p) => getSafeId(p)),
              ),
              wishlistItems: wishRes.data.products || [],
            });
          } catch (err) {
            console.error("Vault Synchronization Failed", err);
          }
        },

        syncGuestDataWithUser: async () => {
          const { cart, wishlistItems } = get();
          const cartItems = Object.values(cart.itemsMap).map((i) => ({
            productId: getSafeId(i.product),
            sizeId: getSafeId(i.size),
            quantity: i.quantity,
          }));

          try {
            const promises = [];
            if (cartItems.length > 0)
              promises.push(api.post("/cart/bulk-add", { items: cartItems }));
            if (wishlistItems.length > 0) {
              promises.push(
                api.post("/wishlist/bulk-add", {
                  productIds: wishlistItems.map((p) => getSafeId(p)),
                }),
              );
            }
            if (promises.length > 0) await Promise.all(promises);
            await get().syncWithServer();
          } catch (err) {
            console.error("Migration Failed", err);
            await get().syncWithServer();
          }
        },

        addToCart: (product, sizeId, quantity = 1, isAuth = false) => {
          const key = getKey(product._id, sizeId);
          const prevCartState = { ...get().cart };

          set((state) => {
            const itemsMap = { ...state.cart.itemsMap };
            const discPrice =
              product.price - (product.price * (product.discount || 0)) / 100;

            if (itemsMap[key]) {
              itemsMap[key] = {
                ...itemsMap[key],
                quantity: itemsMap[key].quantity + quantity,
              };
            } else {
              const sizeObj = product.sizes?.find(
                (s) => getSafeId(s.size) === String(sizeId),
              )?.size || { _id: sizeId, name: "Standard" };
              itemsMap[key] = {
                product: {
                  _id: product._id,
                  name: product.name,
                  images: product.images,
                  price: product.price,
                  discount: product.discount,
                },
                size: sizeObj,
                quantity,
                discountedPrice: discPrice,
                originalPrice: product.price,
                createdAt: Date.now(),
              };
            }
            return {
              cart: {
                itemsMap,
                totalItems: state.cart.totalItems + quantity,
                totalPrice: state.cart.totalPrice + discPrice * quantity,
              },
            };
          });

          if (isAuth) {
            api
              .post("/cart/add", { productId: product._id, sizeId, quantity })
              .catch(() => set({ cart: prevCartState }));
          }
        },

        updateCartItem: (productId, sizeId, qty, isAuth = false) => {
          const key = getKey(productId, sizeId);
          const prevCartState = { ...get().cart };

          set((state) => {
            const itemsMap = { ...state.cart.itemsMap };
            const item = itemsMap[key];
            if (!item) return state;

            const diff = qty - item.quantity;
            itemsMap[key] = { ...item, quantity: qty };

            return {
              cart: {
                itemsMap,
                totalItems: state.cart.totalItems + diff,
                totalPrice: state.cart.totalPrice + item.discountedPrice * diff,
              },
            };
          });

          if (isAuth) {
            api
              .put("/cart/update", { productId, sizeId, quantity: qty })
              .catch(() => set({ cart: prevCartState }));
          }
        },

        removeFromCart: (productId, sizeId, isAuth = false) => {
          const key = getKey(productId, sizeId);
          const prevCartState = { ...get().cart };

          set((state) => {
            const itemsMap = { ...state.cart.itemsMap };
            const item = itemsMap[key];
            if (!item) return state;

            delete itemsMap[key];
            return {
              cart: {
                itemsMap,
                totalItems: state.cart.totalItems - item.quantity,
                totalPrice:
                  state.cart.totalPrice - item.discountedPrice * item.quantity,
              },
            };
          });

          if (isAuth) {
            api
              .delete(`/cart/remove/${productId}/${sizeId}`)
              .catch(() => set({ cart: prevCartState }));
          }
        },

        toggleWishlist: (product, isAuth = false) => {
          const id = getSafeId(product);
          const prevSet = new Set(get().wishlistSet);
          const prevItems = [...get().wishlistItems];

          set((state) => {
            const newSet = new Set(state.wishlistSet);
            let newItems;
            if (newSet.has(id)) {
              newSet.delete(id);
              newItems = state.wishlistItems.filter((p) => getSafeId(p) !== id);
            } else {
              newSet.add(id);
              newItems = [...state.wishlistItems, product];
            }
            return { wishlistSet: newSet, wishlistItems: newItems };
          });

          if (isAuth) {
            const isRemoving = prevSet.has(id);
            const req = isRemoving
              ? api.delete(`/wishlist/remove/${id}`)
              : api.post("/wishlist/add", { productId: id });
            req.catch(() =>
              set({ wishlistSet: prevSet, wishlistItems: prevItems }),
            );
          }
        },
        
        changeItemSize: async (productId, oldSizeId, newSizeId, newSizeName, isAuth = false) => {
          const oldKey = getKey(productId, oldSizeId);
          const newKey = getKey(productId, newSizeId);
          const prevCartState = { ...get().cart };

          set((state) => {
            const itemsMap = { ...state.cart.itemsMap };
            const item = itemsMap[oldKey];
            if (!item || String(oldSizeId) === String(newSizeId)) return state;

            const quantity = item.quantity;

            // 1. Delete old entry
            delete itemsMap[oldKey];

            // 2. Add or Merge into new entry
            if (itemsMap[newKey]) {
              itemsMap[newKey] = {
                ...itemsMap[newKey],
                quantity: itemsMap[newKey].quantity + quantity,
              };
            } else {
              itemsMap[newKey] = {
                ...item,
                size: { _id: newSizeId, name: newSizeName || "Selected" },
                quantity,
                createdAt: item.createdAt || Date.now(),
              };
            }

            return {
              cart: {
                ...state.cart,
                itemsMap,
              },
            };
          });

          if (isAuth) {
            try {
              await api.put("/cart/change-size", { productId, oldSizeId, newSizeId });
              // 🚀 NO syncWithServer here to prevent race conditions with stale backend state
            } catch (err) {
              set({ cart: prevCartState });
            }
          }
        },

        initiateBuyNow: (product, sizeId, quantity = 1) => {
          const discPrice =
            product.price - (product.price * (product.discount || 0)) / 100;
          const foundSize = product.sizes?.find(
            (s) => getSafeId(s.size) === String(sizeId),
          );

          set({
            buyNowItem: {
              product,
              size: foundSize?.size || { _id: sizeId, name: "Selected" },
              quantity,
              discountedPrice: discPrice,
              originalPrice: product.price,
            },
          });
        },

        updateBuyNowQuantity: (qty) => {
          set((state) => {
            if (!state.buyNowItem) return state;
            return {
              buyNowItem: { ...state.buyNowItem, quantity: qty }
            };
          });
        },

        clearCart: (type = "all") => {
          if (type === "direct") {
            set({ buyNowItem: null });
          } else {
            set({ cart: initialState.cart, buyNowItem: null });
          }
        },

        resetStore: () => {
          localStorage.removeItem("vanguard-condition-vault");
          set(initialState);
        },
      }),
      {
        name: "vanguard-condition-vault",
        storage: {
          getItem: (name) => {
            const str = localStorage.getItem(name);
            if (!str) return null;
            const data = JSON.parse(str);
            if (data.state?.wishlistSet)
              data.state.wishlistSet = new Set(data.state.wishlistSet);
            return data;
          },
          setItem: (name, value) => {
            const dataToStore = {
              ...value,
              state: {
                ...value.state,
                wishlistSet: Array.from(value.state.wishlistSet || []),
              },
            };
            localStorage.setItem(name, JSON.stringify(dataToStore));
          },
          removeItem: (name) => localStorage.removeItem(name),
        },
      },
    ),
  ),
);
