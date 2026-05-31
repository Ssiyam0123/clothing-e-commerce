import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { getGuestId } from "@/utils/guestId";
import { useAuthStore } from "@/store/authStore";

export const useProfileOrders = (orderId = null, phone = null, page = null, limit = null) => {
  const { user, isLoading: authLoading } = useAuthStore();
  const guestId = getGuestId();
  const userId = user?._id || guestId;

  const { data: myOrders, isLoading: myOrdersLoading } = useQuery({
    queryKey: ["myOrders", userId, phone, page, limit],
    queryFn: async () => {
      let url = "/orders/myorders";
      const params = new URLSearchParams();
      if (phone) params.append("phone", phone);
      if (page) params.append("page", page);
      if (limit) params.append("limit", limit);
      
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
      
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

  return {
    myOrders: myOrders || [],
    myOrdersLoading,
    orderDetails,
    orderDetailsLoading,
    isDetailsError,
  };
};
