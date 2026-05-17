import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export const useAdminBanners = () => {
  const queryClient = useQueryClient();

  // Fetch all banners (admin)
  const {
    data: banners,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-banners"],
    queryFn: async () => {
      const { data } = await api.get("/banners");
      return data;
    },
  });

  // Create banner
  const createBanner = useMutation({
    mutationFn: (newBanner) => api.post("/banners", newBanner),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
    },
  });

  // Update banner
  const updateBanner = useMutation({
    mutationFn: ({ id, data }) => api.put(`/banners/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
    },
  });

  // Delete banner
  const deleteBanner = useMutation({
    mutationFn: (id) => api.delete(`/banners/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-banners"]);
    },
  });

  return {
    banners,
    isLoading,
    error,
    createBanner: createBanner.mutateAsync,
    updateBanner: updateBanner.mutateAsync,
    deleteBanner: deleteBanner.mutateAsync,
  };
};
