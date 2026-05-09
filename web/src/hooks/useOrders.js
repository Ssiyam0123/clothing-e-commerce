import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { getGuestId } from "@/utils/guestId";
import { swalSuccess, swalError } from "@/utils/swal";
import { useAuthStore } from "@/store/authStore";

export const useOrders = (params = {}, orderId = null) => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const guestId = getGuestId();
  const userId = user?._id || guestId;

  // 1. Admin: Fetch All Orders
  const {
    data: allOrdersData,
    isLoading: allOrdersLoading,
    isFetching: isAllFetching,
  } = useQuery({
    queryKey: ["allOrders", params],
    queryFn: async () => {
      const { data } = await api.get("/orders", { params });
      return data;
    },
    enabled: user?.role === "admin",
    // placeholderData: (previousData) => previousData, // TanStack v5 style (if you updated)
  });

  // 2. User/Guest: My Orders
  const { data: myOrders, isLoading: myOrdersLoading } = useQuery({
    queryKey: ["myOrders", userId],
    queryFn: async () => {
      const { data } = await api.get("/orders/myorders");
      return data;
    },
    enabled: !!userId,
  });

  // 3. Common: Single Order Details
  const { data: orderDetails, isLoading: orderDetailsLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const { data } = await api.get(`/orders/${orderId}`);
      return data;
    },
    enabled: !!orderId,
  });

  // --- MUTATIONS ---

  // 4. User: Initialize Payment/Order
  // 💡 টিপ: ব্যাকএন্ড এখন 'url' (Gateway) অথবা 'redirectUrl' (COD) পাঠায়।
  const initOrder = useMutation({
    mutationFn: async (orderData) => {
      const { data } = await api.post("/orders/init", orderData);
      return data;
    },
    onSuccess: (data) => {
      // অর্ডার সাকসেস হলে কার্ট ক্লিয়ার করার জন্য কুয়েরি ইনভ্যালিডেট করো
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      // রিডাইরেক্ট লজিক (Gateway vs COD)
      if (data.url || data.redirectUrl) {
        window.location.href = data.url || data.redirectUrl;
      }
    },
    onError: (err) => {
      swalError(
        "Order Failed",
        err.response?.data?.message || "Protocol execution interrupted.",
      );
    },
  });

  // 5. Admin: Update Status
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => api.put(`/orders/${id}/status`, { orderStatus: status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allOrders"] });
      if (orderId)
        queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      swalSuccess("Status Updated", "Order logistics status synchronized.");
    },
    onError: (err) => {
      swalError("Update Failed", err.response?.data?.message || "Protocol rejection.");
    }
  });

  // 6. Admin: Sync to Pathao
  const syncToPathaoMutation = useMutation({
    mutationFn: (id) => api.post(`/orders/${id}/pathao-sync`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allOrders"] });
      swalSuccess("Pathao Synced", "Consignment generated successfully.");
    },
    onError: (err) => {
      swalError(
        "Sync Failed",
        err.response?.data?.message || "Pathao API rejected the protocol.",
      );
    },
  });

  // 7. Admin: Update Order
  const updateOrderMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/orders/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allOrders"] });
      if (orderId) queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      swalSuccess("Manifest Updated", "Order deployment data synchronized.");
    },
    onError: (err) => {
      swalError("Update Failed", err.response?.data?.message || "Logic conflict.");
    }
  });

  // 8. Admin: Create Order
  const createAdminOrderMutation = useMutation({
    mutationFn: async (orderData) => {
      const { data } = await api.post("/orders/admin/create", orderData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allOrders"] });
      swalSuccess("Order Created", "The administrative order has been finalized.");
    },
    onError: (err) => {
      swalError(
        "Creation Failed",
        err.response?.data?.message || "Internal system error during order creation."
      );
    },
  });

  return {
    allOrdersData,
    allOrdersLoading,
    isAllFetching,
    myOrders,
    myOrdersLoading,
    orderDetails,
    orderDetailsLoading,
    initOrder,
    updateStatus: updateStatusMutation.mutateAsync,
    isUpdatingStatus: updateStatusMutation.isPending,
    syncToPathao: syncToPathaoMutation.mutateAsync,
    isSyncingPathao: syncToPathaoMutation.isPending,
    updateOrder: updateOrderMutation.mutateAsync,
    isUpdatingOrder: updateOrderMutation.isPending,
    createAdminOrder: createAdminOrderMutation.mutateAsync,
    isCreatingAdminOrder: createAdminOrderMutation.isPending,
  };
};
