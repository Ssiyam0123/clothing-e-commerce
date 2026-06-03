import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { getGuestId } from '../utils/guestId';
import { useAuthStore } from '../store/authStore';

export const useOrders = (page: number = 1, limit: number = 5) => {
  const { user, isLoading: authLoading } = useAuthStore();
  const [guestId, setGuestId] = React.useState<string | null>(null);

  React.useEffect(() => {
    getGuestId().then(setGuestId);
  }, []);

  const userId = user?._id || guestId;

  const { 
    data: ordersData, 
    isLoading: myOrdersLoading,
    error: myOrdersError,
    refetch 
  } = useQuery({
    queryKey: ['myOrders', userId, page, limit],
    queryFn: async () => {
      let url = '/orders/myorders';
      const params = new URLSearchParams();
      if (page) params.append('page', String(page));
      if (limit) params.append('limit', String(limit));
      
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      console.log('📱 MOBILE: Fetching orders', { url, userId, page, limit });

      const { data } = await api.get(url);
      console.log('📦 MOBILE: Orders fetched', { data });
      return data;
    },
    enabled: (!!userId || !!authLoading) && !authLoading,
    staleTime: 1000 * 60 * 5,
  });

  const { 
    data: orderDetails, 
    isLoading: orderDetailsLoading 
  } = useQuery({
    queryKey: ['order', ordersData?._id],
    queryFn: async () => {
      const { data } = await api.get(`/orders/${ordersData?._id}`);
      return data;
    },
    enabled: !!ordersData?._id,
  });

  return {
    orders: Array.isArray(ordersData) ? ordersData : ordersData?.orders || [],
    total: ordersData?.total || 0,
    totalPages: ordersData?.totalPages || 0,
    myOrdersLoading,
    myOrdersError,
    orderDetails,
    orderDetailsLoading,
    refetch,
  };
};
