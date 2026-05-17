import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export const useProductReviews = (productId, page = 1, limit = 5) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["product-reviews", productId, page, limit],
    queryFn: async () => {
      const { data } = await api.get(`/reviews/product/${productId}`, {
        params: { page, limit }
      });
      return data;
    },
    enabled: !!productId,
  });

  const deleteReview = useMutation({
    mutationFn: async (reviewId) => {
      const { data } = await api.delete(`/reviews/${reviewId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-reviews", productId] });
    }
  });

  return {
    reviews: query.data?.reviews || [],
    totalReviews: query.data?.total || 0,
    totalPages: query.data?.pages || 1,
    currentPage: query.data?.currentPage || page,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
    deleteReview: deleteReview.mutateAsync,
    isDeleting: deleteReview.isPending,
  };
};
