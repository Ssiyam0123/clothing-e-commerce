import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { hasPermission } from "@/utils/rbacUtils";

export const useUsers = (params = {}) => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const {
    data: usersData,
    isLoading,
    error,
    isFetching
  } = useQuery({
    queryKey: ["users", params],
    queryFn: async () => {
      const { data } = await api.get("/users", { params });
      return data;
    },
    enabled: !!user && hasPermission(user, ["users:view", "all"]),
  });

  const updateUser = useMutation({
    mutationFn: ({ id, data }) => api.put(`/users/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries(["users"]),
  });

  const deleteUser = useMutation({
    mutationFn: (id) => api.delete(`/users/${id}`),
    onSuccess: () => queryClient.invalidateQueries(["users"]),
  });

  const useUser = (id) => {
    return useQuery({
      queryKey: ["user", id],
      queryFn: async () => (await api.get(`/users/${id}`)).data,
      enabled: !!id && !!user && hasPermission(user, ["users:view", "all"]),
    });
  };

  return { 
    users: usersData?.users, 
    total: usersData?.total,
    pages: usersData?.pages,
    page: usersData?.page,
    isLoading, 
    isFetching,
    error, 
    updateUser, 
    deleteUser,
    useUser
  };
};
