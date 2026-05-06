import { useInfiniteQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function useInfiniteProducts(filters, initialData) {
  return useInfiniteQuery({
    queryKey: ['products', filters],
    queryFn: ({ pageParam = 1 }) => 
      api.get('/products', { params: { ...filters, page: pageParam, limit: 12 } })
        .then(res => res.data),
    getNextPageParam: (lastPage) => 
      lastPage.currentPage < lastPage.pages ? lastPage.currentPage + 1 : undefined,
    initialPageParam: 1,
    initialData: initialData ? {
      pages: [initialData],
      pageParams: [1]
    } : undefined,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  });
}
