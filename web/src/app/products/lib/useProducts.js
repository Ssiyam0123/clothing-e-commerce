import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import api from "@/lib/api";

export const useProducts = (initialFilters = {}, initialData = undefined) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => ({
      search: searchParams.get("search") || initialFilters.search || "",
      sort: searchParams.get("sort") || initialFilters.sort || "",
      category: searchParams.get("category") || initialFilters.category || "all",
      subcategory: searchParams.get("subcategory") || initialFilters.subcategory || "",
      minPrice: searchParams.get("minPrice") || initialFilters.minPrice || "",
      maxPrice: searchParams.get("maxPrice") || initialFilters.maxPrice || "",
      page: Number(searchParams.get("page")) || initialFilters.page || 1,
      limit: initialFilters.limit || 24,
    }),
    [searchParams, initialFilters],
  );

  const updateFilters = useCallback(
    (newFilters) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "" && value !== "all") {
          params.set(key, value.toString());
        } else {
          params.delete(key);
        }
      });
      if (newFilters.page === undefined) params.set("page", "1");
      const queryString = params.toString();
      const newUrl = `${pathname}${queryString ? `?${queryString}` : ""}`;
      
      // Shallow routing: updates URL without hitting Server Component network roundtrip
      window.history.pushState(null, "", newUrl);
    },
    [searchParams, pathname],
  );

  const setSearch = useCallback((search) => updateFilters({ search }), [updateFilters]);
  const setSort = useCallback((sort) => updateFilters({ sort }), [updateFilters]);
  const setCategory = useCallback((category) => updateFilters({ category, subcategory: null }), [updateFilters]);
  const setSubcategory = useCallback((subcategory) => updateFilters({ subcategory }), [updateFilters]);
  const setPriceRange = useCallback((minPrice, maxPrice) => updateFilters({ minPrice, maxPrice }), [updateFilters]);
  const setPage = useCallback((page) => updateFilters({ page: page.toString() }), [updateFilters]);

  const apiParams = useMemo(
    () => ({
      page: filters.page,
      limit: filters.limit,
      search: filters.search,
      sort: filters.sort,
      ...(filters.category !== "all" && filters.category !== "isFeatured" && { category: filters.category }),
      ...(filters.category === "isFeatured" && { isFeatured: "true" }),
      ...(filters.subcategory && { subcategory: filters.subcategory }),
      ...(filters.minPrice && { minPrice: filters.minPrice }),
      ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
    }),
    [filters],
  );

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["products", apiParams],
    queryFn: async () => {
      // Interfaces with the Public Storefront API
      const response = await api.get("/products", { params: apiParams });
      return response.data;
    },
    initialData: initialData,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  return {
    products: data?.products || [],
    pagination: {
      total: data?.total || 0,
      page: data?.currentPage || filters.page,
      pages: data?.pages || 1,
    },
    isLoading,
    isFetching,
    error,
    filters,
    setSearch,
    setSort,
    setCategory,
    setSubcategory,
    setPriceRange,
    setPage,
  };
};
