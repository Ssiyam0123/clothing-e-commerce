import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export const useSubcategories = () => {
  const queryClient = useQueryClient();

  const {
    data: subcategories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["subcategories"],
    queryFn: async () => {
      const { data } = await api.get("/subcategories");
      return data;
    },
  });

  const createSubcategory = useMutation({
    mutationFn: (formData) => api.post("/subcategories", formData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["subcategories"] }),
  });

  const updateSubcategory = useMutation({
    mutationFn: ({ id, data }) => api.put(`/subcategories/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["subcategories"] }),
  });

  const deleteSubcategory = useMutation({
    mutationFn: (id) => api.delete(`/subcategories/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["subcategories"] }),
  });

  return {
    subcategories,
    isLoading,
    error,
    createSubcategory: createSubcategory.mutateAsync,
    updateSubcategory: updateSubcategory.mutateAsync,
    deleteSubcategory: deleteSubcategory.mutateAsync,
  };
};
