import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react"; 
import api from "@/lib/api";

export const useFlashSales = (fetchAll = false) => {
  const queryClient = useQueryClient();

  const { data: allFlashSales, isLoading: allLoading } = useQuery({
    queryKey: ["flash-sales-all"],
    queryFn: async () => (await api.get("/flash-sales")).data,
    enabled: fetchAll,
  });

  const { data: allActiveSales, isLoading: activeLoading } = useQuery({
    queryKey: ["flash-sales-active"],
    queryFn: async () => (await api.get("/flash-sales/active")).data,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 10000, // Background refresh every 10 seconds for real-time stock/timer
  });

  const { data: flashSaleProducts, isLoading: productsLoading } = useQuery({
    queryKey: ["flash-sale-products"],
    queryFn: async () => (await api.get("/flash-sales/products")).data,
  });

  const createFlashSale = useMutation({
    mutationFn: (data) => api.post("/flash-sales", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flash-sales-all"] });
      queryClient.invalidateQueries({ queryKey: ["flash-sales-active"] });
      queryClient.invalidateQueries({ queryKey: ["flash-sale-products"] });
    },
  });

  const updateFlashSale = useMutation({
    mutationFn: ({ id, data }) => api.put(`/flash-sales/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flash-sales-all"] });
      queryClient.invalidateQueries({ queryKey: ["flash-sales-active"] });
      queryClient.invalidateQueries({ queryKey: ["flash-sale-products"] });
    },
  });

  const deleteFlashSale = useMutation({
    mutationFn: (id) => api.delete(`/flash-sales/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flash-sales-all"] });
      queryClient.invalidateQueries({ queryKey: ["flash-sales-active"] });
      queryClient.invalidateQueries({ queryKey: ["flash-sale-products"] });
    },
  });

  const fetchProductsForSale = useCallback(async (saleId) => {
    const { data } = await api.get(`/flash-sales/${saleId}`);

    const productsWithDiscount = data.products.map((product) => {
      const basePrice = product.originalPrice || product.price;
      const flashDiscount = data.discount;

      return {
        ...product,
        originalPrice: basePrice,
        discountedPrice: basePrice - (basePrice * flashDiscount) / 100,
        discountPercentage: flashDiscount,
        flashSaleEnds: data.endDate,
      };
    });






    return { flashSale: data, products: productsWithDiscount };
  }, []);

  return {
    allFlashSales,
    allActiveSales: allActiveSales || [],
    flashSaleProducts,
    allLoading,
    isLoading: activeLoading || productsLoading,
    createFlashSale: createFlashSale.mutateAsync,
    updateFlashSale: updateFlashSale.mutateAsync,
    deleteFlashSale: deleteFlashSale.mutateAsync,
    fetchProductsForSale,
  };
};


export const useSingleFlashSale = (slug) => {
  return useQuery({
    queryKey: ["flash-sale", slug],
    queryFn: async () => (await api.get(`/flash-sales/details/${slug}`)).data,
    enabled: !!slug,
    staleTime: 1000 * 60 * 10,
    refetchInterval: 10000, 
  });
};