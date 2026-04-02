import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export const useCategories = () => {
  const queryClient = useQueryClient();

  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data;
    },
  });

  const createCategory = useMutation({
    mutationFn: (formData) => api.post('/categories', formData),
    onSuccess: () => queryClient.invalidateQueries(['categories']),
  });

  const updateCategory = useMutation({
    mutationFn: ({ id, data }) => api.put(`/categories/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries(['categories']),
  });

  const deleteCategory = useMutation({
    mutationFn: (id) => api.delete(`/categories/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['categories']),
  });

  return { categories, isLoading, error, createCategory, updateCategory, deleteCategory };
};