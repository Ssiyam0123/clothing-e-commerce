import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export const useSubcategories = (params = {}) => {
  const {
    data: subcategories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["subcategories", params],
    queryFn: async () => {
      const { data } = await api.get("/subcategories", { params });
      return data;
    },
  });

  return {
    subcategories: subcategories?.subcategories || [],
    isLoading,
    error,
  };
};
