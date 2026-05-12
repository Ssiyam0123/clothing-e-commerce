import { useQuery, keepPreviousData } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { hasPermission } from "@/utils/rbacUtils";

export const useAdminDashboard = ({ year, month }) => {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: ["admin-dashboard", { year, month }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (year) params.append("year", year);
      if (month && month !== "all") params.append("month", month);
      const { data } = await api.get(`/admin/dashboard?${params.toString()}`);
      return data;
    },
    refetchInterval: 60000, // auto-refresh every 60s
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 15, // Keep in GC for 15 minutes
    placeholderData: keepPreviousData, // v5 syntax for avoiding flickering
    enabled: !!user && hasPermission(user, ["dashboard:view", "reports:view", "all"]),
  });
};
