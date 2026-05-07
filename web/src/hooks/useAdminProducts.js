// src/hooks/useAdminProducts.js
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import api from "@/lib/api";

export const useAdminProducts = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => ({
      search: searchParams.get("search") || "",
      sort: searchParams.get("sort") || "",
      category: searchParams.get("category") || "all",
      page: Number(searchParams.get("page")) || 1,
      limit: 12,
    }),
    [searchParams],
  );

  const updateFilters = useCallback(
    (newFilters) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value && value !== "all") params.set(key, value);
        else params.delete(key);
      });
      if (newFilters.page === undefined) params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  const setSearch = useCallback(
    (search) => updateFilters({ search }),
    [updateFilters],
  );
  const setSort = useCallback(
    (sort) => updateFilters({ sort }),
    [updateFilters],
  );
  const setCategory = useCallback(
    (category) => updateFilters({ category }),
    [updateFilters],
  );
  const setPage = useCallback(
    (page) => updateFilters({ page: page.toString() }),
    [updateFilters],
  );

  const apiParams = useMemo(
    () => ({
      page: filters.page,
      limit: filters.limit,
      search: filters.search,
      sort: filters.sort,
      isActive: "all", // admin sees all
      ...(filters.category !== "all" && { category: filters.category }),
    }),
    [filters],
  );

  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["adminProducts", apiParams],
    queryFn: async () => {
      const response = await api.get("/products", { params: apiParams });
      return response.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  const deleteProduct = useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
    },
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, data }) => {
      const isFormData = data instanceof FormData;
      const response = await api.put(`/products/${id}`, data, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
    },
  });

  const createProduct = useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/products", data, {
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
    setPage,
    deleteProduct: deleteProduct.mutateAsync,
    updateProduct: updateProduct.mutateAsync,
    createProduct: createProduct.mutateAsync,
  };
};
