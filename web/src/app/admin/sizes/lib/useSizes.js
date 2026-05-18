import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export const useSizes = (params = {}) => {
  const queryClient = useQueryClient();

  const {
    data: sizes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sizes", params],
    queryFn: async () => {
      const { data } = await api.get("/sizes", { params });
      return data;
    },
  });

  const createSize = useMutation({
    mutationFn: (newSize) => api.post("/sizes", newSize),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sizes"] }),
  });

  const updateSize = useMutation({
    mutationFn: ({ id, ...data }) => api.put(`/sizes/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sizes"] }),
  });

  const deleteSize = useMutation({
    mutationFn: (id) => api.delete(`/sizes/${id}`),
    onSuccess: () => queryClient.invalidateQueries(["sizes"]),
  });

  return { 
    sizes: sizes?.sizes || [], 
    total: sizes?.total || 0,
    pages: sizes?.pages || 1,
    page: sizes?.page || 1,
    isLoading, 
    error, 
    createSize: createSize.mutateAsync, 
    updateSize: updateSize.mutateAsync, 
    deleteSize: deleteSize.mutateAsync 
  };
};
