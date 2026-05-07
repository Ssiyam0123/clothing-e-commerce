import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { swalSuccess, swalError } from "@/utils/swal";

export const useApiKeys = (enabled = false) => {
  const queryClient = useQueryClient();

  const { data: apiKeys, isLoading } = useQuery({
    queryKey: ["api-keys"],
    queryFn: async () => {
      const { data } = await api.get("/api-keys");
      return data;
    },
    enabled: enabled,
  });

  const updateApiKeys = useMutation({
    mutationFn: async (updatedKeys) => {
      const { data } = await api.put("/api-keys", updatedKeys);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      swalSuccess("Vault Secured", "API credentials synchronized.");
    },
    onError: (err) => {
      swalError(
        "Sync Failed",
        err.response?.data?.message || "Check your credentials",
      );
    },
  });

  return {
    apiKeys,
    isLoading,
    updateApiKeys: updateApiKeys.mutateAsync,
    isSyncing: updateApiKeys.isPending,
  };
};
