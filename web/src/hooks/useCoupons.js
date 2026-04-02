import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuth } from "./useAuth";

export const useCoupons = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const {
    data: coupons,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: async () => (await api.get("/coupons")).data,
    enabled: !!user && user.role === "admin",
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

  return {
    coupons,
    isLoading,
    error,
    createCoupon: createCoupon.mutateAsync,
    updateCoupon: updateCoupon.mutateAsync,
    deleteCoupon: deleteCoupon.mutateAsync,
    validateCoupon: validateCoupon.mutateAsync,
  };
};
