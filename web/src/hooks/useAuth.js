"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import api from "@/lib/api";

export const useAuth = () => {
  const router = useRouter();
  const { data: sessionData, isPending: isLoading } = authClient.useSession();

  const user = useMemo(() => {
    if (!sessionData?.user) return null;

    const rawUser = sessionData.user;
    let parsedAddresses = [];

    try {
      if (typeof rawUser.addresses === 'string') {
        parsedAddresses = JSON.parse(rawUser.addresses || "[]");
      } else if (Array.isArray(rawUser.addresses)) {
        parsedAddresses = rawUser.addresses;
      }
    } catch (e) {
      console.error("Failed to parse addresses sequence:", e);
      parsedAddresses = [];
    }

    return {
      ...rawUser,
      _id: rawUser.id,
      avatar: rawUser.image || rawUser.avatar || "",
      addresses: parsedAddresses
    };
  }, [sessionData]);

  const login = async ({ email, password }) => {
    const { data, error } = await authClient.signIn.email({ email, password });
    if (error) throw new Error(error.message || "Authentication rejected.");
    return data;
  };

  const registerUser = async ({ email, password, name }) => {
    const { data, error } = await authClient.signUp.email({ email, password, name });
    if (error) throw new Error(error.message || "Identity registration failed.");
    return data;
  };

 
  const loginWithSocial = async (provider, redirectPath = "/") => {
    const cleanPath = redirectPath.startsWith("/") ? redirectPath : `/${redirectPath}`;
    

    const callbackURL = `${window.location.origin}${cleanPath}`;

    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: callbackURL, 
      errorCallbackURL: `${window.location.origin}/login?error=auth_failed`,
    });

    if (error) throw new Error(error.message || `${provider} synchronization failed.`);
  };

  const logout = async () => {
    const { error } = await authClient.signOut();
    if (error) throw new Error(error.message || "Termination protocol failed.");
    
    localStorage.removeItem("user");
    router.push("/login");
    router.refresh(); 
  };

  const changePassword = async ({ currentPassword, newPassword }) => {
    const { error } = await authClient.changePassword({
      newPassword,
      currentPassword,
      revokeOtherSessions: true,
    });
    if (error) throw new Error(error.message || "Password update rejected.");
  };

  const forgetPassword = async (email) => {
    const { error } = await authClient.forgetPassword({
      email,
      redirectTo: "/reset-password",
    });
    if (error) throw new Error(error.message || "Reset link delivery failed.");
  };

  const resetPassword = async (newPassword) => {
    const { error } = await authClient.resetPassword({ newPassword });
    if (error) throw new Error(error.message || "New password assignment failed.");
  };

  const updateProfile = async (data) => {
    const { error } = await authClient.updateUser(data);
    if (error) throw new Error(error.message || "Identity update failed.");
    
    await authClient.getSession({ fetchOptions: { force: true } });
  };

  const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const { data } = await api.post('/users/upload-avatar', formData);
    return data.url; 
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    registerUser,
    loginWithSocial,
    logout,
    changePassword,
    forgetPassword,
    resetPassword,
    updateProfile,
    uploadAvatar,
  };
};