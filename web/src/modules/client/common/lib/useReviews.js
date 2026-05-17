import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export const useReviews = (productId, page = 1, limit = 5) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["reviews", productId, page, limit],
    queryFn: async () => {
      const { data } = await api.get(`/reviews/product/${productId}?page=${page}&limit=${limit}`);
      return data;
    },
    enabled: !!productId,
  });

  const createReview = useMutation({
    mutationFn: (formData) =>
      api.post("/reviews", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    },
  });

  const updateReview = useMutation({
    mutationFn: ({ reviewId, data }) =>
      api.put(`/reviews/${reviewId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    },
  });

  const deleteReview = useMutation({
    mutationFn: (reviewId) => api.delete(`/reviews/${reviewId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    },
  });

  return {
    reviews: data?.reviews || [],
    userReview: data?.userReview || null,
    averageRating: data?.averageRating || 0,
    totalReviews: data?.totalReviews || 0,
    total: data?.total || 0,
    pages: data?.pages || 1,
    currentPage: data?.currentPage || 1,
    isLoading,
    error,
    createReview: createReview.mutateAsync,
    updateReview: updateReview.mutateAsync,
    deleteReview: deleteReview.mutateAsync,
  };
};
