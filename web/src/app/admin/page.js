// src/app/admin/page.js
"use client";

import { useState } from "react";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import Loader from "@/components/common/Loader";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import StatusBadge from "@/components/admin/StatusBadge";
import { useAppStore } from "@/store/appStore";
import {
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
  Calendar,
  Filter,
  RefreshCw,
} from "lucide-react";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
const MONTHS = [
  { label: "All Months", value: "all" },
  { label: "Jan", value: "1" },
  { label: "Feb", value: "2" },
  { label: "Mar", value: "3" },
  { label: "Apr", value: "4" },
  { label: "May", value: "5" },
  { label: "Jun", value: "6" },
  { label: "Jul", value: "7" },
  { label: "Aug", value: "8" },
  { label: "Sep", value: "9" },
  { label: "Oct", value: "10" },
  { label: "Nov", value: "11" },
  { label: "Dec", value: "12" },
];

export default function Dashboard() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState("all");

  const { data, isLoading, isFetching, error } = useAdminDashboard({
    year: selectedYear,
    month: selectedMonth,
  });

  const { theme } = useAppStore();

  // 🚀 Only show full‑page loader on the very first load (no data yet)
  if (isLoading && !data) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-[#050505]">
        <Loader />
      </div>
    );
  }

  // Fallback to empty arrays if data is still undefined (should not happen after first load)
  const revenue = data?.revenue || {
    today: 0,
    total: 0,
    avgOrder: 0,
    trend: [],
  };
  const inventory = data?.inventory || {
    totalProducts: 0,
    outOfStock: 0,
    criticalItems: [],
  };
  const categories = data?.categories || [];
  const customers = data?.customers || { total: 0, newThisMonth: 0 };
  const recentOrders = data?.recentOrders || [];

  return (
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto px-4 sm:px-10 pt-10 animate-in fade-in duration-700">
      {/* 1. HEADER - Static */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-7xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase italic leading-none mb-4">
            Vanguard <span className="text-zinc-400">HQ</span>
          </h1>
          <div className="flex items-center gap-3">
            <div
              className={`h-2 w-2 rounded-full ${isFetching ? "bg-indigo-500 animate-spin" : "bg-emerald-500 shadow-[0_0_10px_#10b981]"}`}
            />
            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em]">
              {isFetching ? "Updating Trajectory..." : "System Nominal"}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 p-6 rounded-[2rem] shadow-xl min-w-[240px]">
          <p className="text-[9px] font-black text-zinc-400 uppercase mb-1 tracking-[0.2em]">
            Settlement Today
          </p>
          <p className="text-3xl font-black text-emerald-500 tracking-tighter">
            ৳{revenue.today.toLocaleString()}
          </p>
        </div>
      </div>

      {/* 2. KPI GRID - Static (Doesn't change during fetch) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPI
          label="Annual Revenue"
          value={`৳${revenue.total.toLocaleString()}`}
          icon={<TrendingUp size={20} />}
        />
        <KPI
          label="Identities"
          value={customers.total}
          icon={<Users size={20} />}
        />
        <KPI
          label="SKU Density"
          value={inventory.totalProducts}
          icon={<Package size={20} />}
        />
        <KPI
          label="Transmission"
          value={recentOrders.length}
          icon={<ShoppingCart size={20} />}
        />
      </div>

      {/* 3. ANALYTICS BLOCK - ISOLATED LOADING HERE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 📉 Revenue Graph Card */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900/40 rounded-[3rem] border border-zinc-200 dark:border-white/5 p-8 md:p-10 shadow-sm relative overflow-hidden">
          {/* 🚀 ISOLATED LOADER OVERLAY: শুধু এই গ্রাফের ওপর আসবে */}
          {isFetching && (
            <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <RefreshCw size={24} className="text-indigo-500 animate-spin" />
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-indigo-500">
                  Syncing...
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
            <div>
              <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em]">
                Revenue Trajectory
              </h3>
              <p className="text-xs font-bold text-zinc-500 mt-1 uppercase">
                {selectedMonth === "all"
                  ? `Year: ${selectedYear}`
                  : `${MONTHS.find((m) => m.value === selectedMonth).label} ${selectedYear}`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(Number(e.target.value));
                  setSelectedMonth("all");
                }}
                className="bg-zinc-50 dark:bg-zinc-800 p-2 rounded-xl text-[9px] font-black uppercase outline-none border dark:border-white/10"
              >
                {[2024, 2025, 2026].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-zinc-50 dark:bg-zinc-800 p-2 rounded-xl text-[9px] font-black uppercase outline-none border dark:border-white/10"
              >
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenue.trend}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={theme === "dark" ? "#27272a" : "#e4e4e7"}
                />
                <XAxis
                  dataKey="_id"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 900, fill: "#71717a" }}
                  dy={15}
                  tickFormatter={(val) =>
                    val
                      ? selectedMonth === "all"
                        ? val.split("-")[1]
                        : val.split("-")[2]
                      : ""
                  }
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 900, fill: "#71717a" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#18181b" : "#fff",
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  fillOpacity={1}
                  fill="url(#colorRev)"
                  strokeWidth={4}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 🍕 Category Share */}
        <div className="bg-white dark:bg-zinc-900/40 rounded-[3rem] border border-zinc-200 dark:border-white/5 p-10 shadow-sm relative overflow-hidden">
          {isFetching && (
            <div className="absolute inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-[1px] z-50" />
          )}
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] mb-12 text-center">
            Market Share
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  dataKey="count"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  stroke="none"
                >
                  {categories.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 space-y-3">
            {categories.slice(0, 4).map((cat, i) => (
              <div
                key={i}
                className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest border-b border-zinc-100 dark:border-white/5 pb-2"
              >
                <span className="flex items-center gap-2 text-zinc-500">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  {cat.name}
                </span>
                <span className="dark:text-white">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. ACTIVITY & INVENTORY ALERTS (unchanged) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders Table */}
        <div className="bg-white dark:bg-zinc-900/30 rounded-[3rem] border border-zinc-200 dark:border-white/5 p-10">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em]">
              Operational Logs
            </h3>
            <Link
              href="/admin/orders"
              className="text-[9px] font-black text-indigo-500 hover:text-indigo-400 uppercase tracking-widest"
            >
              Full Archive →
            </Link>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order._id}
                className="flex items-center justify-between p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-white/5"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white dark:bg-zinc-900 border dark:border-white/5 flex items-center justify-center font-black text-zinc-400">
                    {order.user?.name?.charAt(0) || "G"}
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase dark:text-white">
                      {order.user?.name || "Guest"}
                    </p>
                    <p className="text-[8px] font-bold text-zinc-500 tracking-widest">
                      #{order._id.slice(-6).toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black dark:text-white">
                    ৳{order.totalPrice?.toFixed(0)}
                  </p>
                  <StatusBadge value={order.orderStatus} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Inventory Alerts */}
        <div className="bg-zinc-900 dark:bg-black rounded-[3rem] p-10 text-white shadow-2xl border border-white/5">
          <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-8">
            Critical Stock Alerts
          </h3>
          <div className="space-y-6">
            {inventory.criticalItems.length > 0 ? (
              inventory.criticalItems.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0"
                >
                  <div>
                    <p className="text-sm font-black uppercase tracking-tight">
                      {item.name}
                    </p>
                    <span
                      className={`text-[8px] font-black px-2 py-0.5 rounded-sm ${item.status === "OUT" ? "bg-rose-500/20 text-rose-400" : "bg-amber-500/20 text-amber-400"}`}
                    >
                      {item.status === "OUT" ? "Deficit" : "Low Threshold"}
                    </span>
                  </div>
                  <p
                    className={`text-2xl font-black ${item.status === "OUT" ? "text-rose-500" : "text-white"}`}
                  >
                    {item.stock}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-zinc-500 text-[10px] font-black uppercase tracking-widest py-12">
                All stocks healthy
              </p>
            )}
            <Link
              href="/admin/products"
              className="block w-full text-center py-5 bg-white text-black hover:bg-zinc-200 rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] transition-all"
            >
              Sync Inventory Vault
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const KPI = ({ label, value, icon }) => (
  <div className="bg-white dark:bg-zinc-900/50 rounded-[2.5rem] border border-zinc-200 dark:border-white/5 p-8 shadow-sm relative group overflow-hidden">
    <div className="absolute -right-4 -top-4 opacity-[0.03] text-zinc-900 dark:text-white">
      {icon}
    </div>
    <div className="relative z-10">
      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2">
        {label}
      </p>
      <p className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white italic">
        {value || "---"}
      </p>
    </div>
  </div>
);
