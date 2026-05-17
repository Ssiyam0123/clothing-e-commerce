import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { hasPermission } from "@/utils/rbacUtils";

export const useAdminFlashSales = (params = {}) => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const { data: flashSales, isLoading } = useQuery({
    queryKey: ["adminFlashSales", params],
    queryFn: async () => (await api.get("/admin/flash-sales", { params })).data,
    staleTime: 1000 * 60 * 5,
    enabled: !!user && hasPermission(user, ["flash-sales:view", "all"]),
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
    flashSales: flashSales?.flashSales || [],
    total: flashSales?.total || 0,
    pages: flashSales?.pages || 1,
    page: flashSales?.page || 1,
    isLoading,
    createFlashSale: createFlashSale.mutateAsync,
    updateFlashSale: updateFlashSale.mutateAsync,
    deleteFlashSale: deleteFlashSale.mutateAsync,
    getFlashSaleById,
  };
};
