import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export const useCategories = (initialData = undefined) => {
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      // Interfaces with the Public Storefront API
      const { data } = await api.get("/categories");
      return data;
    },
    initialData,
    staleTime: 1000 * 60 * 60, // Long cache for static-like data
    gcTime: 1000 * 60 * 60 * 24,
  });

  return {
    categories: categories || [],
    isLoading,
    error,
  };
};
