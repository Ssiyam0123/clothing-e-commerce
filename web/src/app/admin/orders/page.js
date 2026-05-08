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
import { Skeleton } from "@/components/ui/skeleton";

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

  const { allOrdersData, allOrdersLoading, isAllFetching } =
    useOrders(finalQueryParams);

  const handleSearch = useCallback(
    (val) => {
      setSearch(val);
      setPage(1);
    },
    [setSearch, setPage],
  );

  const handleStatusChange = (newStatus) => {
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
      label: "Status",
      render: (item) => (
        <StatusBadge value={item.orderStatus} />
      ),
    },
    {
      label: "Action",
      render: (item) => (
        <Link
          href={`/admin/orders/${item._id}`}
          className="p-2.5 bg-muted rounded-xl hover:bg-foreground hover:text-background transition-all inline-block shadow-sm"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            ></path>
          </svg>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-8 pb-20 max-w-[1600px] mx-auto px-4 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-card p-8 rounded-[2.5rem] border border-border shadow-sm">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tighter uppercase mb-2 italic">
            Orders <span className="text-muted-foreground/50">Archive</span>
          </h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
            Logistics & Dispatch Management
          </p>
        </div>
        <div className="bg-muted px-6 py-4 rounded-2xl border border-border flex items-center gap-4">
          <span className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">
            Total Orders
          </span>
          <span className="text-2xl font-black text-foreground leading-none">
            {allOrdersData?.total || 0}
          </span>
        </div>
      </div>

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
            onClick={() => handleStatusChange(s)}
            className={`px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${
              status === s
                ? "bg-foreground text-background border-foreground"
                : "bg-card text-muted-foreground border-border hover:border-foreground"
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

      <div className="relative">
        {allOrdersLoading ? (
          <TableSkeleton rowCount={10} colCount={6} />
        ) : (
          <div
            className={`transition-opacity duration-300 ${isAllFetching ? "opacity-50 pointer-events-none" : "opacity-100"}`}
          >
            <DataTable columns={columns} data={allOrdersData?.orders || []} />

            {allOrdersData?.pages > 1 && (
              <div className="mt-12 flex justify-center">
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
  );
}

export default function AdminOrders() {
  return (
    <Suspense
      fallback={
        <div className="p-10 space-y-10">
          <Skeleton className="h-[120px] rounded-[2.5rem]" />
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-10 w-24 rounded-full" />)}
          </div>
          <Skeleton className="h-20 rounded-full" />
          <Skeleton className="h-[600px] rounded-[2.5rem]" />
        </div>
      }
    >
      <AdminOrdersContent />
    </Suspense>
  );
}
