import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export const useReviews = (productId) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const { data } = await api.get(`/reviews/product/${productId}`);
      return data;
    },
    enabled: !!productId,
  });

  const createReview = useMutation({
    mutationFn: (formData) => api.post('/reviews', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
    onSuccess: () => {
      // 👈 FIXED: React Query v5 syntax { queryKey: [...] }
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
    },
  });

  const updateReview = useMutation({
    mutationFn: ({ reviewId, data }) => api.put(`/reviews/${reviewId}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
    },
  });

  const deleteReview = useMutation({
    mutationFn: (reviewId) => api.delete(`/reviews/${reviewId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
    },
  });

  return {
    reviews: data?.reviews || [],
    userReview: data?.userReview || null,
    averageRating: data?.averageRating || 0,
    totalReviews: data?.totalReviews || 0,
    isLoading,
    error,
    createReview: createReview.mutateAsync,
    updateReview: updateReview.mutateAsync,
    deleteReview: deleteReview.mutateAsync,
  };
};