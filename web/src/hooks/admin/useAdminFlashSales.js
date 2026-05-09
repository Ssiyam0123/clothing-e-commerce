// src/hooks/admin/useAdminFlashSales.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export const useAdminFlashSales = () => {
  const queryClient = useQueryClient();

  const { data: flashSales, isLoading } = useQuery({
    queryKey: ["adminFlashSales"],
    queryFn: async () => (await api.get("/admin/flash-sales")).data,
    staleTime: 1000 * 60 * 5,
  });

  const createFlashSale = useMutation({
    mutationFn: (data) => api.post("/admin/flash-sales", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminFlashSales"] });
      queryClient.invalidateQueries({ queryKey: ["flash-sales-active"] });
    },
  });

  const updateFlashSale = useMutation({
    mutationFn: ({ id, data }) => api.put(`/admin/flash-sales/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminFlashSales"] });
      queryClient.invalidateQueries({ queryKey: ["flash-sales-active"] });
    },
  });

  const deleteFlashSale = useMutation({
    mutationFn: (id) => api.delete(`/admin/flash-sales/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminFlashSales"] });
      queryClient.invalidateQueries({ queryKey: ["flash-sales-active"] });
    },
  });

  const getFlashSaleById = async (id) => {
      const response = await api.get(`/admin/flash-sales/${id}`);
      return response.data;
  };

  return {
    flashSales: flashSales || [],
    isLoading,
    createFlashSale: createFlashSale.mutateAsync,
    updateFlashSale: updateFlashSale.mutateAsync,
    deleteFlashSale: deleteFlashSale.mutateAsync,
    getFlashSaleById,
  };
};
