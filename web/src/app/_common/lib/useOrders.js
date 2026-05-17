// src/hooks/client/useOrders.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { getGuestId } from "@/utils/guestId";
import { swalError } from "@/utils/swal";
import { useAuthStore } from "@/store/authStore";

export const useOrders = (orderId = null, phone = null) => {
  const queryClient = useQueryClient();
  const { user, isLoading: authLoading } = useAuthStore();
  const guestId = getGuestId();
  const userId = user?._id || guestId;

  const { data: myOrders, isLoading: myOrdersLoading } = useQuery({
    queryKey: ["myOrders", userId, phone],
    queryFn: async () => {
      const url = phone ? `/orders/myorders?phone=${phone}` : "/orders/myorders";
      const { data } = await api.get(url);
      return data;
    },
    enabled: (!!userId || !!phone) && !authLoading,
    staleTime: 1000 * 60 * 5,
  });

  const { data: orderDetails, isLoading: orderDetailsLoading, isError: isDetailsError } = useQuery({
    queryKey: ["order", orderId, userId, phone],
    queryFn: async () => {
      const url = phone ? `/orders/${orderId}?phone=${phone}` : `/orders/${orderId}`;
      const { data } = await api.get(url);
      return data;
    },
    enabled: !!orderId,
  });

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
    myOrders: myOrders || [],
    isLoading: myOrdersLoading,
    orderDetails,
    orderDetailsLoading,
    isError: isDetailsError,
    initOrder: initOrder.mutateAsync,
    isInitializing: initOrder.isPending,
  };
};
