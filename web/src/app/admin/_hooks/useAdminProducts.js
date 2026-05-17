// src/hooks/admin/useAdminProducts.js
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { hasPermission } from "@/utils/rbacUtils";

export const useAdminProducts = (initialFilters = {}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();

  const filters = useMemo(
    () => ({
      search: initialFilters.search !== undefined ? initialFilters.search : (searchParams.get("search") || ""),
      sort: initialFilters.sort !== undefined ? initialFilters.sort : (searchParams.get("sort") || ""),
      category: initialFilters.category !== undefined ? initialFilters.category : (searchParams.get("category") || "all"),
      subcategory: searchParams.get("subcategory") || "all",
      stockStatus: searchParams.get("stockStatus") || "all",
      isActive: searchParams.get("isActive") || "all",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      page: initialFilters.page !== undefined ? initialFilters.page : (Number(searchParams.get("page")) || 1),
      limit: initialFilters.limit || 30,
    }),
    [searchParams, initialFilters],
  );

  const updateFilters = useCallback(
    (newFilters) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "" && value !== "all") {
           params.set(key, value);
        } else {
           params.delete(key);
        }
      });
      if (newFilters.page === undefined) params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  const setSearch = useCallback((search) => updateFilters({ search }), [updateFilters]);
  const setSort = useCallback((sort) => updateFilters({ sort }), [updateFilters]);
  const setCategory = useCallback((category) => updateFilters({ category, subcategory: "all" }), [updateFilters]);
  const setSubcategory = useCallback((subcategory) => updateFilters({ subcategory }), [updateFilters]);
  const setStockStatus = useCallback((stockStatus) => updateFilters({ stockStatus }), [updateFilters]);
  const setIsActive = useCallback((isActive) => updateFilters({ isActive }), [updateFilters]);
  const setPriceRange = useCallback((min, max) => updateFilters({ minPrice: min, maxPrice: max }), [updateFilters]);
  const setPage = useCallback((page) => updateFilters({ page: page.toString() }), [updateFilters]);

  const apiParams = useMemo(
    () => ({
      page: filters.page,
      limit: filters.limit,
      search: filters.search,
      sort: filters.sort,
      category: filters.category,
      subcategory: filters.subcategory,
      stockStatus: filters.stockStatus,
      isActive: filters.isActive,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    }),
    [filters],
  );

  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["adminProducts", apiParams],
    queryFn: async () => {
      // 🚀 Pointing to the new Admin-specific namespace
      const response = await api.get("/admin/products", { params: apiParams });
      return response.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 0,
    gcTime: 1000 * 60 * 30,
    enabled: !!user && hasPermission(user, ["products:view", "all"]),
  });

  const deleteProduct = useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/admin/products/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
    },
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, data }) => {
      const isFormData = data instanceof FormData;
      const response = await api.put(`/admin/products/${id}`, data, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
    },
  });

  const createProduct = useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/admin/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
    },
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
    setStockStatus,
    setIsActive,
    setPriceRange,
    setPage,
    deleteProduct: deleteProduct.mutateAsync,
    updateProduct: updateProduct.mutateAsync,
    createProduct: createProduct.mutateAsync,
  };
};
