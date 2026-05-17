import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuthStore } from "@/modules/client/auth/lib/authStore";

export const useProfile = () => {
  const { user } = useAuthStore();

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData) => {
      const isFormData = profileData instanceof FormData;
      const { data } = await api.put("/users/profile", profileData, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
      });
      return data;
    },
    onSuccess: (data) => {
      // Update auth store with new user data
      useAuthStore.setState({ user: data });
    }
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (passwords) => {
      const { data } = await api.put("/users/change-password", passwords);
      return data;
    }
  });

  return {
    user,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    changePassword: changePasswordMutation.mutateAsync,
    isChangingPassword: changePasswordMutation.isPending,
  };
};
