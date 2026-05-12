import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { hasPermission } from "@/utils/rbacUtils";

export const useCoupons = (params = {}) => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const {
    data: coupons,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-coupons", params],
    queryFn: async () => (await api.get("/coupons", { params })).data,
    enabled: !!user && hasPermission(user, 'coupons:view'),
  });

  const createCoupon = useMutation({
    mutationFn: (data) => api.post("/coupons", data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] }),
  });

  const updateCoupon = useMutation({
    mutationFn: ({ id, data }) => api.put(`/coupons/${id}`, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] }),
  });

  const deleteCoupon = useMutation({
    mutationFn: (id) => api.delete(`/coupons/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] }),
  });

  const validateCoupon = useMutation({
    mutationFn: async ({ code, cartTotal }) => {
      const { data } = await api.post("/coupons/validate", { code, cartTotal });
      return data;
    },
  });

  const getCoupon = (id, usageParams = { page: 1, limit: 10 }) => {
    return useQuery({
      queryKey: ["admin-coupon", id, usageParams],
      queryFn: async () => (await api.get(`/coupons/${id}`, { params: usageParams })).data,
      enabled: !!user && hasPermission(user, 'coupons:view') && !!id && id !== "new",
    });
  };

  return {
    coupons: coupons?.coupons || [],
    total: coupons?.total || 0,
    pages: coupons?.pages || 1,
    page: coupons?.page || 1,
    getCoupon,
    isLoading,
    error,
    createCoupon: createCoupon.mutateAsync,
    updateCoupon: updateCoupon.mutateAsync,
    deleteCoupon: deleteCoupon.mutateAsync,
    validateCoupon: validateCoupon.mutateAsync,
  };
};
