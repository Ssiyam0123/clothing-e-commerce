import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAppStore } from "@/store/appStore";

export default function useAuth() {
  const { setUser } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      setIsAuthenticated(true);
    }
    return response.data;
  };

  const register = async (name, email, password) => {
    const response = await api.post("/auth/register", { name, email, password });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  const forgotPassword = async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  };

  const resetPassword = async (token, password) => {
    const response = await api.post(`/auth/reset-password?token=${token}`, { password });
    return response.data;
  };

  // ✅ Add updateProfile
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

  // ✅ Add uploadAvatar (convenience)
  const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await api.put("/users/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setUser(response.data);
    return response.data.avatar;
  };

  // ✅ Add changePassword
  const changePassword = async (passwords) => {
    const response = await api.put("/users/change-password", passwords);
    return response.data;
  };

  return {
    user: useAppStore((state) => state.user),
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    uploadAvatar,
    changePassword,
  };
}