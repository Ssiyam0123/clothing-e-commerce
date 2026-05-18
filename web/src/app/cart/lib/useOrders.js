import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { swalError } from "@/utils/swal";

export const useOrders = () => {
  const queryClient = useQueryClient();

  const initOrder = useMutation({
    mutationFn: async (orderData) => {
      const { data } = await api.post("/orders/init", orderData);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      if (data.url || data.redirectUrl) {
        window.location.href = data.url || data.redirectUrl;
      }
    },
    onError: (err) => {
      swalError("Order Failed", err.response?.data?.message || "Protocol execution interrupted.");
    },
  });

  return {
    initOrder: initOrder.mutateAsync,
    isInitializing: initOrder.isPending,
  };
};
