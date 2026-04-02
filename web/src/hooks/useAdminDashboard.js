// src/hooks/useAdminDashboard.js
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/admin/dashboard');
      return data;
    },
    refetchInterval: 30000, // refresh every 30 seconds
  });
};