// src/hooks/admin/useAdminCategories.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuthStore } from "@/modules/client/auth/lib/authStore";
import { hasPermission } from "@/utils/rbacUtils";

export const useAdminCategories = (params = {}, initialData = undefined) => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["adminCategories", params],
    queryFn: async () => {
      const { data } = await api.get("/admin/categories", { params });
      return data;
    },
    initialData,
    staleTime: 1000 * 60 * 5,
    enabled: !!user && hasPermission(user, ["categories:view", "all"]),
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

  const toggleFeatured = useMutation({
    mutationFn: async ({ id, isFeatured }) => {
      const response = await api.put(`/admin/categories/${id}`, { isFeatured });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return {
    categories: categories?.categories || [],
    total: categories?.total || 0,
    pages: categories?.pages || 1,
    page: categories?.page || 1,
    isLoading,
    error,
    createCategory: createCategory.mutateAsync,
    updateCategory: updateCategory.mutateAsync,
    deleteCategory: deleteCategory.mutateAsync,
    toggleFeatured: toggleFeatured.mutateAsync,
  };
};
