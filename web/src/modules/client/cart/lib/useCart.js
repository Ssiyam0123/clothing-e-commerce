import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { getGuestId } from "@/utils/guestId";
import { useAuthStore } from "@/modules/client/auth/lib/authStore";

export const useCart = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const guestId = getGuestId();
  const userId = user?._id || guestId; // Use guest ID if not logged in

  const {
    data: cart,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cart", userId], // Unique key per user/guest
    queryFn: async () => {
      const { data } = await api.get("/cart");
      return data;
    },
  });

  const addToCart = useMutation({
    mutationFn: ({ productId, sizeId, quantity }) =>
      api.post("/cart/add", { productId, sizeId, quantity }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const updateCartItem = useMutation({
    mutationFn: ({ productId, sizeId, quantity }) =>
      api.put("/cart/update", { productId, sizeId, quantity }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const removeFromCart = useMutation({
    mutationFn: ({ productId, sizeId }) =>
      api.delete(`/cart/remove/${productId}/${sizeId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const clearCart = useMutation({
    mutationFn: () => api.delete("/cart"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  return {
    cart,
    isLoading,
    error,
    addToCart: addToCart.mutateAsync,
    updateCartItem: updateCartItem.mutateAsync,
    removeFromCart: removeFromCart.mutateAsync,
    clearCart: clearCart.mutateAsync,
  };
};
