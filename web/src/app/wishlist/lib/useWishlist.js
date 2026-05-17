import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { getGuestId } from "@/utils/guestId";
import { useAuthStore } from "@/store/authStore";

export const useWishlist = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const guestId = getGuestId();
  const userId = user?._id || guestId;

  const {
    data: wishlist,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["wishlist", userId],
    queryFn: async () => {
      const { data } = await api.get("/wishlist");
      return data;
    },
  });

  const addToWishlist = useMutation({
    mutationFn: (productId) => api.post("/wishlist/add", { productId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });

  const removeFromWishlist = useMutation({
    mutationFn: (productId) => api.delete(`/wishlist/remove/${productId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });

  const clearWishlist = useMutation({
    mutationFn: () => api.delete("/wishlist"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });

  const isInWishlist = (productId) => {
    return wishlist?.products?.some((p) => p._id === productId) || false;
  };

  return {
    wishlist,
    isLoading,
    error,
    addToWishlist: addToWishlist.mutateAsync,
    removeFromWishlist: removeFromWishlist.mutateAsync,
    clearWishlist: clearWishlist.mutateAsync,
    isInWishlist,
  };
};
