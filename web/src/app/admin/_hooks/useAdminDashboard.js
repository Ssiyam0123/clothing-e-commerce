import { useQuery, keepPreviousData } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { hasPermission } from "@/utils/rbacUtils";

const STALE_TIME = 1000 * 60 * 5; // 5 minutes
const GC_TIME = 1000 * 60 * 15; // 15 minutes

export const useDashboardStats = () => {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: async () => {
      const { data } = await api.get("/admin/dashboard/stats");
      return data;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!user && hasPermission(user, ["dashboard:view", "reports:view", "all"]),
  });
};

export const useDashboardRecentOrders = () => {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: ["admin-dashboard-recent-orders"],
    queryFn: async () => {
      const { data } = await api.get("/admin/dashboard/recent-orders");
      return data;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!user && hasPermission(user, ["dashboard:view", "reports:view", "all"]),
  });
};

export const useDashboardInventoryAlerts = () => {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: ["admin-dashboard-inventory-alerts"],
    queryFn: async () => {
      const { data } = await api.get("/admin/dashboard/inventory-alerts");
      return data;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!user && hasPermission(user, ["dashboard:view", "reports:view", "all"]),
  });
};

export const useDashboardRevenueTrend = ({ year, month }) => {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: ["admin-dashboard-revenue-trend", { year, month }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (year) params.append("year", year);
      if (month && month !== "all") params.append("month", month);
      const { data } = await api.get(`/admin/dashboard/revenue-trend?${params.toString()}`);
      return data;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    placeholderData: keepPreviousData,
    enabled: !!user && hasPermission(user, ["dashboard:view", "reports:view", "all"]),
  });
};

export const useDashboardCategoryStats = () => {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: ["admin-dashboard-category-stats"],
    queryFn: async () => {
      const { data } = await api.get("/admin/dashboard/category-stats");
      return data;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!user && hasPermission(user, ["dashboard:view", "reports:view", "all"]),
  });
};

export const useDashboardCustomerGrowth = ({ year, month }) => {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: ["admin-dashboard-customer-growth", { year, month }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (year) params.append("year", year);
      if (month && month !== "all") params.append("month", month);
      const { data } = await api.get(`/admin/dashboard/customer-growth?${params.toString()}`);
      return data;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    placeholderData: keepPreviousData,
    enabled: !!user && hasPermission(user, ["dashboard:view", "reports:view", "all"]),
  });
};

export const useDashboardRetention = () => {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: ["admin-dashboard-retention"],
    queryFn: async () => {
      const { data } = await api.get("/admin/dashboard/retention");
      return data;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!user && hasPermission(user, ["dashboard:view", "reports:view", "all"]),
  });
};

// Keep for backward compatibility
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
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    placeholderData: keepPreviousData, // v5 syntax for avoiding flickering
    enabled: !!user && hasPermission(user, ["dashboard:view", "reports:view", "all"]),
  });
};
