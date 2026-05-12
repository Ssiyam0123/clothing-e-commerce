import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";

export const useRoles = () => {
  const queryClient = useQueryClient();

  const {
    data: roles,
    isLoading,
    error
  } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const { data } = await api.get("/roles");
      return data;
    },
  });

  const createRole = useMutation({
    mutationFn: (data) => api.post("/roles", data),
    onSuccess: () => queryClient.invalidateQueries(["roles"]),
  });

  const updateRole = useMutation({
    mutationFn: ({ id, data }) => api.put(`/roles/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries(["roles"]),
  });

  const deleteRole = useMutation({
    mutationFn: (id) => api.delete(`/roles/${id}`),
    onSuccess: () => queryClient.invalidateQueries(["roles"]),
  });

  return {
    roles,
    isLoading,
    error,
    createRole,
    updateRole,
    deleteRole
  };
};
