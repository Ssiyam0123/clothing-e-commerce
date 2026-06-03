import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../lib/api';

const getKey = (pId: string, sId: string) => `${String(pId)}_${String(sId)}`;
const getSafeId = (obj: any) =>
  obj && typeof obj === 'object' ? String(obj._id || obj.id) : String(obj);

interface CartItem {
  product: {
    _id: string;
    name: string;
    images?: string[];
    price: number;
    discount?: number;
    [key: string]: any;
  };
  size: {
    _id: string;
    name: string;
  };
  quantity: number;
  discountedPrice: number;
  originalPrice: number;
  createdAt: number;
}

interface CartState {
  itemsMap: { [key: string]: CartItem };
  totalItems: number;
  totalPrice: number;
  wishlistItems: any[];
  wishlistSet: Set<string>;
  buyNowItem: CartItem | null;

  syncWithServer: () => Promise<void>;
  syncGuestDataWithUser: () => Promise<void>;
  addToCart: (product: any, sizeId: string, quantity?: number, isAuth?: boolean) => void;
  updateCartItem: (productId: string, sizeId: string, qty: number, isAuth?: boolean) => void;
  removeFromCart: (productId: string, sizeId: string, isAuth?: boolean) => void;
  changeItemSize: (productId: string, oldSizeId: string, newSizeId: string, newSizeName?: string, isAuth?: boolean) => Promise<void>;
  toggleWishlist: (product: any, isAuth?: boolean) => void;
  clearCart: () => void;
  resetStore: () => void;
  setBuyNowItem: (product: any, sizeId: string, quantity?: number) => void;
  clearBuyNowItem: () => void;
}

const initialState = {
  itemsMap: {} as { [key: string]: CartItem },
  totalItems: 0,
  totalPrice: 0,
  wishlistItems: [] as any[],
  wishlistSet: new Set<string>(),
  buyNowItem: null as CartItem | null,
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      ...initialState,

      syncWithServer: async () => {
        try {
          const [cartRes, wishRes] = await Promise.all([
            api.get('/cart'),
            api.get('/wishlist'),
          ]);

          const itemsMap: { [key: string]: CartItem } = {};
          let totalItems = 0;
          let totalPrice = 0;

          cartRes.data.items?.forEach((item: any, index: number) => {
            const productId = getSafeId(item.product);
            const sizeId = getSafeId(item.size);
            const key = getKey(productId, sizeId);

            const productPrice = Number(item.product?.price || 0);
            const productDiscount = Number(item.product?.discount || 0);
            const safeDiscountedPrice =
              Number(item.discountedPrice) ||
              productPrice - (productPrice * productDiscount) / 100;

            itemsMap[key] = {
              product: item.product,
              size: item.size || { _id: sizeId, name: 'Standard' },
              quantity: Number(item.quantity || 0),
              discountedPrice: safeDiscountedPrice,
              originalPrice: productPrice,
              createdAt: item.createdAt || Date.now() + index,
            };

            totalItems += Number(item.quantity || 0);
            totalPrice += safeDiscountedPrice * Number(item.quantity || 0);
          });

          const wishlist = wishRes.data.products || [];
          set({
            itemsMap,
            totalItems,
            totalPrice: Number(totalPrice.toFixed(2)),
            wishlistItems: wishlist,
            wishlistSet: new Set<string>(wishlist.map((p: any) => getSafeId(p))),
          });
        } catch (err) {
          console.warn('[CartStore] Sync with server failed:', err);
        }
      },

      syncGuestDataWithUser: async () => {
        const { itemsMap, wishlistItems } = get();
        const cartItems = Object.values(itemsMap).map((i) => ({
          productId: getSafeId(i.product),
          sizeId: getSafeId(i.size),
          quantity: i.quantity,
        }));

        try {
          const promises = [];
          if (cartItems.length > 0) {
            promises.push(api.post('/cart/bulk-add', { items: cartItems }));
          }
          if (wishlistItems.length > 0) {
            promises.push(
              api.post('/wishlist/bulk-add', {
                productIds: wishlistItems.map((p) => getSafeId(p)),
              })
            );
          }
          if (promises.length > 0) {
            await Promise.all(promises);
          }
          await get().syncWithServer();
        } catch (err) {
          console.warn('[CartStore] Migration of guest data failed:', err);
          await get().syncWithServer();
        }
      },

      addToCart: (product, sizeId, quantity = 1, isAuth = false) => {
        const key = getKey(product._id, sizeId);
        const prevItemsMap = { ...get().itemsMap };
        const prevTotalItems = get().totalItems;
        const prevTotalPrice = get().totalPrice;

        const discPrice = product.price - (product.price * (product.discount || 0)) / 100;
        const itemsMap = { ...get().itemsMap };

        if (itemsMap[key]) {
          itemsMap[key] = {
            ...itemsMap[key],
            quantity: itemsMap[key].quantity + quantity,
          };
        } else {
          const sizeObj = product.sizes?.find(
            (s: any) => getSafeId(s.size) === String(sizeId)
          )?.size || { _id: sizeId, name: 'Selected' };

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

        set({
          itemsMap,
          totalItems: prevTotalItems + quantity,
          totalPrice: Number((prevTotalPrice + discPrice * quantity).toFixed(2)),
        });

        if (isAuth) {
          api
            .post('/cart/add', { productId: product._id, sizeId, quantity })
            .catch(() => {
              set({ itemsMap: prevItemsMap, totalItems: prevTotalItems, totalPrice: prevTotalPrice });
            });
        }
      },

      updateCartItem: (productId, sizeId, qty, isAuth = false) => {
        const key = getKey(productId, sizeId);
        const prevItemsMap = { ...get().itemsMap };
        const prevTotalItems = get().totalItems;
        const prevTotalPrice = get().totalPrice;

        const itemsMap = { ...get().itemsMap };
        const item = itemsMap[key];
        if (!item) return;

        const diff = qty - item.quantity;
        itemsMap[key] = { ...item, quantity: qty };

        set({
          itemsMap,
          totalItems: prevTotalItems + diff,
          totalPrice: Number((prevTotalPrice + item.discountedPrice * diff).toFixed(2)),
        });

        if (isAuth) {
          api
            .put('/cart/update', { productId, sizeId, quantity: qty })
            .catch(() => {
              set({ itemsMap: prevItemsMap, totalItems: prevTotalItems, totalPrice: prevTotalPrice });
            });
        }
      },

      removeFromCart: (productId, sizeId, isAuth = false) => {
        const key = getKey(productId, sizeId);
        const prevItemsMap = { ...get().itemsMap };
        const prevTotalItems = get().totalItems;
        const prevTotalPrice = get().totalPrice;

        const itemsMap = { ...get().itemsMap };
        const item = itemsMap[key];
        if (!item) return;

        delete itemsMap[key];
        set({
          itemsMap,
          totalItems: prevTotalItems - item.quantity,
          totalPrice: Number((prevTotalPrice - item.discountedPrice * item.quantity).toFixed(2)),
        });

        if (isAuth) {
          api
            .delete(`/cart/remove/${productId}/${sizeId}`)
            .catch(() => {
              set({ itemsMap: prevItemsMap, totalItems: prevTotalItems, totalPrice: prevTotalPrice });
            });
        }
      },

      changeItemSize: async (productId, oldSizeId, newSizeId, newSizeName = 'Selected', isAuth = false) => {
        const oldKey = getKey(productId, oldSizeId);
        const newKey = getKey(productId, newSizeId);
        const prevItemsMap = { ...get().itemsMap };

        const itemsMap = { ...get().itemsMap };
        const item = itemsMap[oldKey];
        if (!item || String(oldSizeId) === String(newSizeId)) return;

        const quantity = item.quantity;
        delete itemsMap[oldKey];

        if (itemsMap[newKey]) {
          itemsMap[newKey] = {
            ...itemsMap[newKey],
            quantity: itemsMap[newKey].quantity + quantity,
          };
        } else {
          itemsMap[newKey] = {
            ...item,
            size: { _id: newSizeId, name: newSizeName },
            quantity,
            createdAt: item.createdAt || Date.now(),
          };
        }

        set({ itemsMap });

        if (isAuth) {
          try {
            await api.put('/cart/change-size', { productId, oldSizeId, newSizeId });
          } catch (err) {
            set({ itemsMap: prevItemsMap });
          }
        }
      },

      toggleWishlist: (product, isAuth = false) => {
        const id = getSafeId(product);
        const prevSet = new Set(get().wishlistSet);
        const prevItems = [...get().wishlistItems];

        const wishlistSet = new Set(get().wishlistSet);
        let wishlistItems;

        if (wishlistSet.has(id)) {
          wishlistSet.delete(id);
          wishlistItems = get().wishlistItems.filter((p) => getSafeId(p) !== id);
        } else {
          wishlistSet.add(id);
          wishlistItems = [...get().wishlistItems, product];
        }

        set({ wishlistSet, wishlistItems });

        if (isAuth) {
          const isRemoving = prevSet.has(id);
          const req = isRemoving
            ? api.delete(`/wishlist/remove/${id}`)
            : api.post('/wishlist/add', { productId: id });

          req.catch(() => {
            set({ wishlistSet: prevSet, wishlistItems: prevItems });
          });
        }
      },

      clearCart: () => {
        set({ itemsMap: {}, totalItems: 0, totalPrice: 0 });
      },

      setBuyNowItem: (product, sizeId, quantity = 1) => {
        const discPrice = product.price - (product.price * (product.discount || 0)) / 100;
        const sizeObj = product.sizes?.find(
          (s: any) => getSafeId(s.size) === String(sizeId)
        )?.size || { _id: sizeId, name: 'Selected' };
        set({
          buyNowItem: {
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
          },
        });
      },

      clearBuyNowItem: () => {
        set({ buyNowItem: null });
      },

      resetStore: () => {
        set(initialState);
      },
    }),
    {
      name: 'vanguard-cart-storage',
      storage: {
        getItem: async (name) => {
          const str = await AsyncStorage.getItem(name);
          if (!str) return null;
          const data = JSON.parse(str);
          if (data.state && data.state.wishlistItems) {
            data.state.wishlistSet = new Set(data.state.wishlistItems.map((p: any) => getSafeId(p)));
          }
          return data;
        },
        setItem: async (name, value) => {
          const dataToStore = {
            ...value,
            state: {
              ...value.state,
              wishlistSet: undefined, // Don't serialize set directly
            },
          };
          await AsyncStorage.setItem(name, JSON.stringify(dataToStore));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);
