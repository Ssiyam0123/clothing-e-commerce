import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export const useBanners = () => {
  const { data: banners, isLoading, error } = useQuery({
    queryKey: ['banners'],
    queryFn: async () => {
      const { data } = await api.get('/banners/active');
      return data;
    },
  });
  return { banners, isLoading, error };
};