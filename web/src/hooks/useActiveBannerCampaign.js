import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export const useActiveBannerCampaign = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['active-banner-campaign'],
    queryFn: async () => {
      const { data } = await api.get('/banner-campaigns/active');
      return data;
    },
    refetchInterval: 60000,
  });
  return { activeCampaign: data, isLoading, error };
};