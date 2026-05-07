import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";

export const useSizes = (categoryId = null) => {
  const queryClient = useQueryClient();

  const {
    data: sizes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sizes", categoryId],
    queryFn: async () => {
      const url = categoryId ? `/sizes?category=${categoryId}` : "/sizes";
      const { data } = await api.get(url);
      return data; // Already sorted by natural order from backend
    },
  });

  const createSize = useMutation({
    mutationFn: (newSize) => api.post("/sizes", newSize),
    onSuccess: () => queryClient.invalidateQueries(["sizes"]),
  });

  const updateSize = useMutation({
    mutationFn: ({ id, ...data }) => api.put(`/sizes/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries(["sizes"]),
  });

  const deleteSize = useMutation({
    mutationFn: (id) => api.delete(`/sizes/${id}`),
    onSuccess: () => queryClient.invalidateQueries(["sizes"]),
  });

  return { sizes, isLoading, error, createSize, updateSize, deleteSize };
};
