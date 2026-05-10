import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export const useProductHistory = (id) => {
  return useQuery({
    queryKey: ["product-history", id],
    queryFn: async () => {
      const { data } = await api.get(`/admin/products/${id}/history`);
      return data;
    },
    enabled: !!id,
  });
};
