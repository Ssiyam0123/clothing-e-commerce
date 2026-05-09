// src/hooks/client/useFlashSale.js
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export const useFlashSales = () => {
  const { data: allActiveSales, isLoading: activeLoading } = useQuery({
    queryKey: ["flash-sales-active"],
    queryFn: async () => (await api.get("/flash-sales/active")).data,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: currentFlashSale, isLoading: productsLoading } = useQuery({
    queryKey: ["flash-sale-current"],
    queryFn: async () => (await api.get("/flash-sales/current")).data,
    staleTime: 1000 * 60 * 5,
  });

  return {
    allActiveSales: allActiveSales || [],
    currentFlashSale,
    isLoading: activeLoading || productsLoading,
  };
};

export const useSingleFlashSale = (slug) => {
  return useQuery({
    queryKey: ["flash-sale", slug],
    queryFn: async () => (await api.get(`/flash-sales/slug/${slug}`)).data,
    enabled: !!slug,
    staleTime: 1000 * 60 * 10,
    refetchInterval: 30000,
  });
};
