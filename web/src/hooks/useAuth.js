import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { useAppStore } from "@/store/appStore";

export default function useAuth() {
  const { user, setUser } = useAppStore();
  // যদি স্টোরে ইউজার থাকে, তবে আর লোডিং দেখানোর দরকার নেই
  const [isLoading, setIsLoading] = useState(!user);

  const checkAuth = useCallback(async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.get("/auth/me");
      setUser(response.data);
    } catch (error) {
      console.error("Auth Check Failed:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  useEffect(() => {
    // যদি ইউজার না থাকে এবং লোডিং ট্রু থাকে, তবেই চেক করো
    if (!user) {
      checkAuth();
    } else {
      setIsLoading(false);
    }
  }, [user, checkAuth]);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
    }
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const register = async (name, email, password) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  };

  const forgotPassword = async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  };

  const resetPassword = async (token, password) => {
    const response = await api.post(`/auth/reset-password?token=${token}`, {
      password,
    });
    return response.data;
  };

  const updateProfile = async (userData) => {
    const formData = new FormData();
    if (userData.name) formData.append("name", userData.name);
    if (userData.phone) formData.append("phone", userData.phone);
    if (userData.bio) formData.append("bio", userData.bio);
    if (userData.image) formData.append("avatar", userData.image);

    const response = await api.put("/users/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setUser(response.data);
    return response.data;
  };

  const changePassword = async (passwords) => {
    const response = await api.put("/users/change-password", passwords);
    return response.data;
  };

  return {
    user,
    isAuthenticated: !!user, // 🚀 FIX: ইউজার থাকলে ট্রু, না থাকলে ফলস
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    changePassword,
  };
}
