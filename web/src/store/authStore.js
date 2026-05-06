import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "@/lib/api";
import { useProductStore } from "./productStore";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: true,
      isAuthenticated: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post("/auth/login", { email, password });

          localStorage.setItem("token", data.token);
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });

          await useProductStore.getState().syncGuestDataWithUser();

          return data;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem("token");

        useProductStore.getState().resetStore();

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      checkSession: async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          set({ isLoading: false, isAuthenticated: false });
          return;
        }

        try {
          const { data } = await api.get("/auth/me");
          set({
            user: data,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          await useProductStore.getState().syncWithServer();
        } catch (error) {
          console.error("Session expired or invalid");
          get().logout();
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post("/auth/register", {
            name,
            email,
            password,
          });

          if (data.token) {
            localStorage.setItem("token", data.token);
            set({
              user: data.user,
              token: data.token,
              isAuthenticated: true,
              isLoading: false,
            });

            await useProductStore.getState().syncGuestDataWithUser();
          } else {
            set({ isLoading: false });
          }

          return data;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      updateProfile: async (profileData) => {
        try {
          const isFormData = profileData instanceof FormData;
          const { data } = await api.put("/users/profile", profileData, {
            headers: isFormData
              ? { "Content-Type": "multipart/form-data" }
              : {},
          });
          set({ user: data });
          return data;
        } catch (error) {
          throw error;
        }
      },

      forgotPassword: async (email) => {
        return (await api.post("/auth/forgot-password", { email })).data;
      },

      resetPassword: async (token, password) => {
        return (
          await api.post(`/auth/reset-password?token=${token}`, { password })
        ).data;
      },

      changePassword: async (passwords) => {
        return (await api.put("/users/change-password", passwords)).data;
      },
    }),
    {
      name: "auth-vault",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
