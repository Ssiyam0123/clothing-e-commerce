"use client";

import { useState, useCallback, Suspense, useMemo } from "react";
import { useOrders } from "@/hooks/useOrders";
import { useFilters } from "@/hooks/useFilters";
import DataTable from "@/components/admin/DataTable";
import TableSkeleton from "@/components/common/TableSkeleton";
import FilterBar from "@/components/common/FilterBar";
import Pagination from "@/components/common/Pagination";
import StatusBadge from "@/components/admin/StatusBadge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, ShoppingBag, Edit2, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function AdminOrdersContent() {
  const { search, setSearch, sort, setSort, page, setPage, queryParams } =
    useFilters({
      initialLimit: 10,
      initialSort: "-createdAt",
    });

  const [status, setStatus] = useState("all");

  const finalQueryParams = useMemo(
    () => ({
      ...queryParams,
      status: status !== "all" ? status : undefined,
    }),
    [queryParams, status],
  );

  const { allOrdersData, allOrdersLoading, isAllFetching, updateStatus } =
    useOrders(finalQueryParams);

  const handleQuickStatusUpdate = async (id, newStatus) => {
    try {
      await updateStatus({ id, status: newStatus });
      // Toast is already handled in hook
    } catch (err) {
      // Error is already handled in hook
    }
  };

  const handleSearch = useCallback(
    (val) => {
      setSearch(val);
      setPage(1);
    },
    [setSearch, setPage],
  );

  const handleFilterStatusChange = (newStatus) => {
    setStatus(newStatus);
    setPage(1);
  };

  const columns = [
    {
      label: "Order ID",
      render: (item) => (
        <Link
          href={`/admin/orders/${item._id}`}
          className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20 hover:scale-105 transition-all inline-block italic"
        >
          #{item?._id?.slice(-8)}
        </Link>
      ),
    },
    {
      label: "Customer",
      render: (item) => (
        <div>
          <p className="font-black text-foreground text-sm uppercase tracking-tight">
            {item?.user?.name || "Guest"}
          </p>
          <p className="text-[10px] text-muted-foreground font-bold tracking-widest mt-1">
            {item?.shippingAddress?.phone}
          </p>
        </div>
      ),
    },
    {
      label: "Date & Time",
      render: (item) => {
        const dateObj = new Date(item.createdAt);
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-black text-foreground uppercase tracking-tighter leading-none">
              {dateObj.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.1em]">
              {dateObj.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          </div>
        );
      },
    },
    {
      label: "Total",
      render: (item) => (
        <span className="text-base font-black text-foreground tracking-tighter">
          ৳{item?.totalPrice?.toLocaleString()}
        </span>
      ),
    },
    {
      label: "Delivery Status",
      render: (item) => (
        <select
          value={item.orderStatus}
          onChange={(e) => handleQuickStatusUpdate(item._id, e.target.value)}
          className={cn(
            "h-10 rounded-xl px-4 text-[9px] font-black uppercase tracking-widest border transition-all cursor-pointer outline-none appearance-none bg-background shadow-sm",
            item.orderStatus === "Delivered" && "text-emerald-600 border-emerald-600/20 bg-emerald-600/5",
            item.orderStatus === "Cancelled" && "text-rose-600 border-rose-600/20 bg-rose-600/5",
            item.orderStatus === "Pending" && "text-amber-600 border-amber-600/20 bg-amber-600/5",
            item.orderStatus === "Processing" && "text-indigo-600 border-indigo-600/20 bg-indigo-600/5",
            item.orderStatus === "Shipped" && "text-blue-600 border-blue-600/20 bg-blue-600/5"
          )}
        >
          {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((s) => (
            <option key={s} value={s} className="bg-background text-foreground uppercase tracking-widest">
              {s}
            </option>
          ))}
        </select>
      ),
    },
    {
      label: "Command",
      render: (item) => (
        <div className="flex items-center gap-2 justify-end">
          <Link
            href={`/admin/orders/${item._id}`}
            className="p-2.5 bg-muted text-muted-foreground hover:bg-foreground hover:text-background rounded-xl transition-all shadow-sm border border-border/10 group"
            title="Inspect Manifest"
          >
            <Eye size={16} className="group-hover:scale-110 transition-transform" />
          </Link>
          <Link
            href={`/admin/orders/${item._id}/edit`}
            className="p-2.5 bg-indigo-600/10 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-all shadow-sm border border-border/10 group"
            title="Refine Deployment"
          >
            <Edit2 size={16} className="group-hover:scale-110 transition-transform" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="admin-page-container">
      <div className="admin-section-header">
        <div>
          <h1 className="admin-title">
            Orders <span className="text-muted-foreground/50">Archive</span>
          </h1>
          <p className="admin-subtitle">
            Logistics & Dispatch Management
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
          <div className="bg-muted px-6 py-3 md:py-4 rounded-2xl border border-border flex items-center justify-between md:justify-start gap-4">
            <span className="text-[9px] md:text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">
              Total Orders
            </span>
            <span className="text-xl md:text-2xl font-black text-foreground leading-none">
              {allOrdersData?.total || 0}
            </span>
          </div>
          <Button asChild className="bg-foreground text-background hover:bg-primary hover:text-white h-12 md:h-16 px-8 md:px-10 rounded-xl md:rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 group">
            <Link href="/admin/orders/new">
              <Plus size={18} className="mr-3 transition-transform group-hover:rotate-90" /> Initialize Order
            </Link>
          </Button>
        </div>
      </div>

      <div className="admin-table-form">
        <div className="p-6 md:p-8 space-y-8 border-b border-border/10 bg-background/20">
          <div className="flex flex-wrap gap-2 pb-2 overflow-x-auto no-scrollbar">
            {[
              "all",
              "Pending",
              "Processing",
              "Shipped",
              "Delivered",
              "Cancelled",
            ].map((s) => (
              <button
                key={s}
                onClick={() => handleFilterStatusChange(s)}
                className={`px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${
                  status === s
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background/50 text-muted-foreground border-border hover:border-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <FilterBar
            search={search}
            onSearchSubmit={handleSearch}
            onSearchChange={handleSearch}
            sort={sort}
            onSortChange={setSort}
            sortOptions={[
              { label: "🌟 Default Sequence", value: "all" },
              { label: "Newest First", value: "-createdAt" },
              { label: "Oldest First", value: "createdAt" },
              { label: "Price: High", value: "-totalPrice" },
              { label: "Price: Low", value: "totalPrice" },
            ]}
            searchPlaceholder="Order ID, Customer Name or Phone..."
          />
        </div>

        <div className="relative pt-0">
          {allOrdersLoading ? (
            <div className="p-8">
              <TableSkeleton rowCount={10} colCount={6} />
            </div>
          ) : (
            <div
              className={`transition-opacity duration-300 ${isAllFetching ? "opacity-50 pointer-events-none" : "opacity-100"}`}
            >
              <DataTable columns={columns} data={allOrdersData?.orders || []} className="border-none rounded-none" />

              {allOrdersData?.pages > 1 && (
                <div className="p-8 border-t border-border/10 bg-background/10">
                  <Pagination
                    page={allOrdersData?.page}
                    totalPages={allOrdersData?.pages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminOrders() {
  return (
    <Suspense
      fallback={
        <div className="admin-page-container">
          <div className="admin-section-header">
             <div className="space-y-2">
                <Skeleton className="h-10 w-[200px] md:w-[300px] rounded-xl" />
                <Skeleton className="h-4 w-32 md:w-48" />
             </div>
             <Skeleton className="h-12 md:h-14 w-full md:w-56 rounded-full" />
          </div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-10 w-24 rounded-full" />)}
          </div>
          <Skeleton className="min-h-[80px] w-full rounded-full" />
          <Skeleton className="min-h-[500px] w-full rounded-[2.5rem]" />
        </div>
      }
    >
      <AdminOrdersContent />
    </Suspense>
  );
}
