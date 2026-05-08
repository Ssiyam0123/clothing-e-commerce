"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { AdminHeader } from "@/components/admin/dashboard/AdminHeader";
import { StatsCards } from "@/components/admin/dashboard/StatsCards";

// Dynamically import heavy components for better first load performance
const RevenueChart = dynamic(() => import("@/components/admin/dashboard/RevenueChart").then(mod => mod.RevenueChart), {
  ssr: false,
  loading: () => <div className="h-[480px] w-full bg-card animate-pulse rounded-[3rem] border border-border" />
});

const CategoryPie = dynamic(() => import("@/components/admin/dashboard/CategoryPie").then(mod => mod.CategoryPie), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-card animate-pulse rounded-[3rem] border border-border" />
});

const RecentOrders = dynamic(() => import("@/components/admin/dashboard/RecentOrders").then(mod => mod.RecentOrders), {
  ssr: false
});

const InventoryAlerts = dynamic(() => import("@/components/admin/dashboard/InventoryAlerts").then(mod => mod.InventoryAlerts), {
  ssr: false
});

export default function Dashboard() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState("all");

  const { data, isLoading, isFetching } = useAdminDashboard({
    year: selectedYear,
    month: selectedMonth,
  });

  // Fallback to empty data structure if undefined
  const revenue = data?.revenue || { today: 0, total: 0, avgOrder: 0, trend: [] };
  const inventory = data?.inventory || { totalProducts: 0, outOfStock: 0, criticalItems: [] };
  const categories = data?.categories || [];
  const customers = data?.customers || { total: 0, newThisMonth: 0 };
  const recentOrders = data?.recentOrders || [];

  return (
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto px-4 sm:px-10 pt-10 animate-in fade-in duration-700">
      {/* 1. HEADER */}
      <AdminHeader isFetching={isFetching} todayRevenue={revenue.today} isLoading={isLoading} />

      {/* 2. KPI GRID */}
      <StatsCards 
        revenue={revenue} 
        customers={customers} 
        inventory={inventory} 
        recentOrdersCount={recentOrders.length} 
        isLoading={isLoading}
      />

      {/* 3. ANALYTICS BLOCK */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <RevenueChart 
          revenue={revenue}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          isFetching={isFetching}
          isLoading={isLoading}
        />
        <CategoryPie 
          categories={categories} 
          isFetching={isFetching} 
          isLoading={isLoading}
        />
      </div>

      {/* 4. ACTIVITY & INVENTORY ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentOrders recentOrders={recentOrders} isLoading={isLoading} />
        <InventoryAlerts inventory={inventory} isLoading={isLoading} />
      </div>
    </div>
  );
}
