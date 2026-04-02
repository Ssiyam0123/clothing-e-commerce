import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react'; // <-- Senior Fix: Imported useCallback
import api from '@/lib/api';

export const useFlashSales = (fetchAll = false) => {
  const queryClient = useQueryClient();

  // All flash sales (admin)
  const { data: allFlashSales, isLoading: allLoading } = useQuery({
    queryKey: ['flash-sales-all'],
    queryFn: async () => (await api.get('/flash-sales')).data,
    enabled: fetchAll,
  });

  // All active flash sales (public)
  const { data: allActiveSales, isLoading: activeLoading } = useQuery({
    queryKey: ['flash-sales-active'],
    queryFn: async () => (await api.get('/flash-sales/active')).data,
  });

  // First active sale with products (legacy)
  const { data: flashSaleProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['flash-sale-products'],
    queryFn: async () => (await api.get('/flash-sales/products')).data,
  });

  const createFlashSale = useMutation({
    mutationFn: (data) => api.post('/flash-sales', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flash-sales-all'] });
      queryClient.invalidateQueries({ queryKey: ['flash-sales-active'] });
      queryClient.invalidateQueries({ queryKey: ['flash-sale-products'] });
    },
  });

  const updateFlashSale = useMutation({
    mutationFn: ({ id, data }) => api.put(`/flash-sales/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flash-sales-all'] });
      queryClient.invalidateQueries({ queryKey: ['flash-sales-active'] });
      queryClient.invalidateQueries({ queryKey: ['flash-sale-products'] });
    },
  });

  const deleteFlashSale = useMutation({
    mutationFn: (id) => api.delete(`/flash-sales/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flash-sales-all'] });
      queryClient.invalidateQueries({ queryKey: ['flash-sales-active'] });
      queryClient.invalidateQueries({ queryKey: ['flash-sale-products'] });
    },
  });

  // <-- SENIOR FIX: Wrapped in useCallback to prevent Infinite Loops in useEffect -->
  const fetchProductsForSale = useCallback(async (saleId) => {
    const { data } = await api.get(`/flash-sales/${saleId}`);
    
    const productsWithDiscount = data.products.map(product => {
      const basePrice = product.originalPrice || product.price; 
      const flashDiscount = data.discount; 

      return {
        ...product,
        originalPrice: basePrice,
        discountedPrice: basePrice - (basePrice * flashDiscount / 100),
        discountPercentage: flashDiscount,
        flashSaleEnds: data.endDate,
      };
    });

    return { flashSale: data, products: productsWithDiscount };
  }, []); // Empty dependency array means the function reference never changes

  return {
    allFlashSales,
    allActiveSales,
    flashSaleProducts,
    allLoading,
    isLoading: activeLoading || productsLoading,
    createFlashSale: createFlashSale.mutateAsync,
    updateFlashSale: updateFlashSale.mutateAsync,
    deleteFlashSale: deleteFlashSale.mutateAsync,
    fetchProductsForSale,
  };
};