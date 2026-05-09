// src/hooks/admin/useAdminCategories.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export const useAdminCategories = (initialData = undefined) => {
  const queryClient = useQueryClient();

  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["adminCategories"],
    queryFn: async () => {
      const { data } = await api.get("/admin/categories");
      return data;
    },
    initialData,
    staleTime: 1000 * 60 * 5,
  });

  const createCategory = useMutation({
    mutationFn: async (formData) => {
      const response = await api.post("/admin/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/admin/categories/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/admin/categories/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return {
    categories: categories || [],
    isLoading,
    error,
    createCategory: createCategory.mutateAsync,
    updateCategory: updateCategory.mutateAsync,
    deleteCategory: deleteCategory.mutateAsync,
  };
};
