"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useAdminDashboard } from "@/app/admin/_hooks/useAdminDashboard";
import { AdminHeader } from "@/app/admin/_components/dashboard/AdminHeader";
import { StatsCards } from "@/app/admin/_components/dashboard/StatsCards";
import { hasPermission } from "@/utils/rbacUtils";
import { useAuthStore } from "@/store/authStore";
import { getFirstAllowedRoute } from "@/utils/adminRoutes";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/common/Loader";

// Dynamically import heavy components for better first load performance
const RevenueChart = dynamic(() => import("@/app/admin/_components/dashboard/RevenueChart").then(mod => mod.RevenueChart), {
  ssr: false,
  loading: () => <div className="min-h-[300px] md:min-h-[480px] w-full bg-card animate-pulse rounded-[3rem] border border-border" />
});

const CategoryPie = dynamic(() => import("@/app/admin/_components/dashboard/CategoryPie").then(mod => mod.CategoryPie), {
  ssr: false,
  loading: () => <div className="min-h-[300px] md:min-h-[400px] w-full bg-card animate-pulse rounded-[3rem] border border-border" />
});

const RecentOrders = dynamic(() => import("@/app/admin/_components/dashboard/RecentOrders").then(mod => mod.RecentOrders), {
  ssr: false
});

const InventoryAlerts = dynamic(() => import("@/app/admin/_components/dashboard/InventoryAlerts").then(mod => mod.InventoryAlerts), {
  ssr: false
});

const TopSellingCategories = dynamic(() => import("@/app/admin/_components/dashboard/TopSellingCategories").then(mod => mod.TopSellingCategories), {
  ssr: false
});

const UserGrowthChart = dynamic(() => import("@/app/admin/_components/dashboard/UserGrowthChart").then(mod => mod.UserGrowthChart), {
  ssr: false
});

const UsersTable = dynamic(() => import("@/app/admin/_components/dashboard/UsersTable").then(mod => mod.UsersTable), {
  ssr: false
});

export default function Dashboard() {
  const [revYear, setRevYear] = useState(new Date().getFullYear());
  const [revMonth, setRevMonth] = useState("all");
  
  const [userYear, setUserYear] = useState(new Date().getFullYear());
  const [userMonth, setUserMonth] = useState("all");

  const { data: revData, isLoading: revLoading, isFetching: revFetching } = useAdminDashboard({
    year: revYear,
    month: revMonth,
  });

  const { data: userData, isLoading: userLoading, isFetching: userFetching } = useAdminDashboard({
    year: userYear,
    month: userMonth,
  });

  // Use revData for general stats and revenue
  const revenue = revData?.revenue || { today: 0, total: 0, avgOrder: 0, trend: [], forecast: 0 };
  const inventory = revData?.inventory || { totalProducts: 0, outOfStock: 0, criticalItems: [] };
  const categories = revData?.categories || [];
  const recentOrders = revData?.recentOrders || [];
  const analytics = revData?.analytics || { mostSoldCategories: [], retentionRate: 0 };
  
  // Use userData for user growth specifically
  const customers = userData?.customers || { total: 0, newThisMonth: 0, growth: [], recent: [] };

  const { user } = useAuthStore();
  const router = useRouter();
  const canViewDashboard = hasPermission(user, ["dashboard:view", "reports:view", "all"]);

  useEffect(() => {
    if (!canViewDashboard) {
      const targetRoute = getFirstAllowedRoute(user, hasPermission);
      if (targetRoute && targetRoute !== "/admin") {
        router.replace(targetRoute);
      }
    }
  }, [canViewDashboard, user, router]);

  if (!canViewDashboard) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }


  const isLoading = revLoading || userLoading;

  const isFetching = revFetching || userFetching;

  return (
    <div className="admin-page-container space-y-8 pb-12">
      {/* 1. HEADER */}
      <AdminHeader 
        isFetching={revFetching} 
        todayRevenue={revenue.today} 
        isLoading={revLoading}
      />

      {/* 2. KPI GRID */}
      <StatsCards 
        revenue={revenue} 
        customers={{ ...customers, retentionRate: analytics.retentionRate }} 
        inventory={inventory} 
        recentOrdersCount={recentOrders.length} 
        isLoading={revLoading}
      />

      {/* 3. MAIN ANALYTICS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 min-h-[480px]">
          <RevenueChart 
            revenue={revenue}
            selectedYear={revYear}
            setSelectedYear={setRevYear}
            selectedMonth={revMonth}
            setSelectedMonth={setRevMonth}
            isFetching={revFetching}
            isLoading={revLoading}
          />
        </div>
        <div className="lg:col-span-1">
          <CategoryPie 
            categories={categories} 
            isFetching={revFetching} 
            isLoading={revLoading}
          />
        </div>
      </div>

      {/* 4. USER GROWTH & TOP CATEGORIES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <UserGrowthChart 
            data={customers.growth}
            selectedYear={userYear}
            setSelectedYear={setUserYear}
            selectedMonth={userMonth}
            setSelectedMonth={setUserMonth}
            isFetching={userFetching}
            isLoading={userLoading}
          />
        </div>
        <div className="lg:col-span-1">
          <TopSellingCategories 
            categories={analytics.mostSoldCategories} 
            isLoading={revLoading}
          />
        </div>
      </div>

      {/* 5. DATA TABLES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentOrders recentOrders={recentOrders} isLoading={revLoading} />
        <UsersTable users={customers.recent} isLoading={userLoading} />
      </div>

      {/* 6. INVENTORY ALERTS */}
      <InventoryAlerts inventory={inventory} isLoading={revLoading} />
    </div>
  );
}
