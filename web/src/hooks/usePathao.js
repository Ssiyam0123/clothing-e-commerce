import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export const usePathao = (cityId, zoneId) => {
  // 1. Fetch Cities
  const { data: cities, isLoading: citiesLoading } = useQuery({
    queryKey: ['pathao-cities'],
    queryFn: async () => {
      const { data } = await api.get('/pathao/cities');
      return data;
    },
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours (cities rarely change)
  });

  // 2. Fetch Zones (Dependent on cityId)
  const { data: zones, isLoading: zonesLoading } = useQuery({
    queryKey: ['pathao-zones', cityId],
    queryFn: async () => {
      if (!cityId) return [];
      const { data } = await api.get(`/pathao/zones/${cityId}`);
      return data;
    },
    enabled: !!cityId, // Shudu city select korlei ei API hit hobe
    staleTime: 1000 * 60 * 60 * 24,
  });

  // 3. Fetch Areas (Dependent on zoneId)
  const { data: areas, isLoading: areasLoading } = useQuery({
    queryKey: ['pathao-areas', zoneId],
    queryFn: async () => {
      if (!zoneId) return [];
      const { data } = await api.get(`/pathao/areas/${zoneId}`);
      return data;
    },
    enabled: !!zoneId, // Shudu zone select korlei ei API hit hobe
    staleTime: 1000 * 60 * 60 * 24,
  });

  return { 
    cities, 
    zones, 
    areas, 
    citiesLoading, 
    zonesLoading, 
    areasLoading 
  };
};