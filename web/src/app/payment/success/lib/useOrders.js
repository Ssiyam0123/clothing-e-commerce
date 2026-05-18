import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export const useOrders = (orderId = null) => {
  const { data: orderDetails, isLoading: orderDetailsLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const { data } = await api.get(`/orders/${orderId}`);
      return data;
    },
    enabled: !!orderId,
  });

  return {
    orderDetails,
    orderDetailsLoading,
  };
};
