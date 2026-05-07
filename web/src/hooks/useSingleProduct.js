import { useQuery } from "@tanstack/react-query";

// src/hooks/useSingleProduct.js
export const useProductBySlug = (slug) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const response = await api.get(`/products/details/${slug}`);
      return response.data;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 10,
  });
};
