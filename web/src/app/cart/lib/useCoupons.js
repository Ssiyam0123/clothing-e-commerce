import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";

export const useCoupons = () => {
  const validateCoupon = useMutation({
    mutationFn: async ({ code, cartTotal }) => {
      const { data } = await api.post("/coupons/validate", { code, cartTotal });
      return data;
    },
  });

  return {
    validateCoupon: validateCoupon.mutateAsync,
  };
};
