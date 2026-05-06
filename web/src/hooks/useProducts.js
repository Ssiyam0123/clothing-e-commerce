// src/hooks/useProducts.js
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import api from '@/lib/api';

export const useProducts = (initialFilters = {}, initialData = undefined) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read filter values from URL
  const filters = useMemo(() => ({
    search: searchParams.get('search') || initialFilters.search || '',
    sort: searchParams.get('sort') || initialFilters.sort || '',
    category: searchParams.get('category') || initialFilters.category || 'all',
    page: Number(searchParams.get('page')) || initialFilters.page || 1,
    limit: initialFilters.limit || 30,
    isFeatured: initialFilters.isFeatured || false,
  }), [searchParams, initialFilters]);

  // Helper to update URL and refetch
  const updateFilters = useCallback((newFilters) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    // Reset page to 1 when any filter except page changes
    if (newFilters.page === undefined) {
      params.set('page', '1');
    }
    
    const queryString = params.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`, { scroll: false });
  }, [searchParams, pathname, router]);

  // Individual setters
  const setSearch = useCallback((search) => updateFilters({ search }), [updateFilters]);
  const setSort = useCallback((sort) => updateFilters({ sort }), [updateFilters]);
  const setCategory = useCallback((category) => updateFilters({ category }), [updateFilters]);
  const setPage = useCallback((page) => updateFilters({ page: page.toString() }), [updateFilters]);

  // Prepare query parameters for API (exclude 'all' category)
  const apiParams = useMemo(() => ({
    page: filters.page,
    limit: filters.limit,
    search: filters.search,
    sort: filters.sort,
    ...(filters.category !== 'all' && { category: filters.category }),
    ...(filters.isFeatured && { isFeatured: 'true' }),
  }), [filters]);

  // TanStack Query
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ['products', apiParams],
    queryFn: async () => {
      const response = await api.get('/products', { params: apiParams });
      return response.data;
    },
    initialData: initialData,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  return {
    // Data
    products: data?.products || [],
    pagination: {
      total: data?.total || 0,
      page: data?.currentPage || filters.page,
      pages: data?.pages || 1,
    },
    isLoading,
    isFetching,
    error,
    // Current filter values
    filters,
    // Setters to update URL
    setSearch,
    setSort,
    setCategory,
    setPage,
  };
};