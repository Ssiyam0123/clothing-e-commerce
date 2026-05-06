import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { swalSuccess, swalError } from '@/utils/swal';

export const useSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data } = await api.get('/settings');
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const updateSettings = useMutation({
    mutationFn: async (updatedData) => {
      const isFormData = updatedData instanceof FormData;
      const { data } = await api.put('/settings', updatedData, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      swalSuccess("Success", "Site protocol updated effectively.");
    },
    onError: (err) => {
      swalError("Update Failed", err.response?.data?.message || "Something went wrong");
    }
  });

  return {
    settings,
    isLoading,
    updateSettings: updateSettings.mutateAsync,
    isUpdating: updateSettings.isPending
  };
};