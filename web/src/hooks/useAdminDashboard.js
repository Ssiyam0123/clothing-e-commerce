// src/hooks/useAdminDashboard.js
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export const useAdminDashboard = ({ year, month }) => {
  return useQuery({
    queryKey: ["admin-dashboard", { year, month }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (year) params.append("year", year);
      if (month && month !== "all") params.append("month", month);
      const { data } = await api.get(`/admin/dashboard?${params.toString()}`);
      return data;
    },
    refetchInterval: 30000, // auto-refresh every 30s
    keepPreviousData: true, // avoids flickering when year/month change
  });
};
