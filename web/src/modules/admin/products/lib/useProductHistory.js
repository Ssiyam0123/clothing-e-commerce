import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export const useProductHistory = (id, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["product-history", id, page, limit],
    queryFn: async () => {
      const { data } = await api.get(`/admin/products/${id}/history`, {
        params: { page, limit }
      });
      return data;
    },
    enabled: !!id,
  });
};
