import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { revalidateHome } from "@/app/actions/revalidate";

export const useAdminBannerCampaigns = (params = {}) => {
  const queryClient = useQueryClient();

  const {
    data: campaigns,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-banner-campaigns", params],
    queryFn: async () => {
      const { data } = await api.get("/banner-campaigns", { params });
      return data;
    },
  });

  const createCampaign = useMutation({
    mutationFn: (formData) =>
      api.post("/banner-campaigns", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-banner-campaigns"]);
      revalidateHome();
    },
  });

  const updateCampaign = useMutation({
    mutationFn: ({ id, formData }) =>
      api.put(`/banner-campaigns/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-banner-campaigns"]);
      revalidateHome();
    },
  });

  const deleteCampaign = useMutation({
    mutationFn: (id) => api.delete(`/banner-campaigns/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-banner-campaigns"]);
      revalidateHome();
    },
  });

  return {
    campaigns: campaigns?.campaigns || [],
    total: campaigns?.total || 0,
    pages: campaigns?.pages || 1,
    page: campaigns?.page || 1,
    isLoading,
    error,
    createCampaign: createCampaign.mutateAsync,
    updateCampaign: updateCampaign.mutateAsync,
    deleteCampaign: deleteCampaign.mutateAsync,
  };
};
