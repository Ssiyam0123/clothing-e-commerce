"use client";

import { useState, useCallback, Suspense, useMemo } from "react";
import { useAdminOrders } from "@/app/admin/orders/lib/useAdminOrders";
import { useFilters } from "@/app/_common/lib/useFilters";
import TableSkeleton from "@/components/common/TableSkeleton";
import OrdersSearchAndFilter from "./components/OrdersSearchAndFilter";
import OrdersTable from "./components/OrdersTable";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function AdminOrdersContent() {
  const { search, setSearch, sort, setSort, page, setPage, queryParams } =
    useFilters({
      initialLimit: 30,
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

  const { orders, total, pages, isLoading, isAllFetching, updateOrder } =
    useAdminOrders(finalQueryParams);

  const handleQuickStatusUpdate = async (id, newStatus) => {
    try {
      await updateOrder({ id, data: { orderStatus: newStatus } });
    } catch (err) {
      console.error(err);
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

  return (
    <div className="admin-page-container">
      <div className="admin-section-header">
        <div>
          <h1 className="admin-title">
            Orders <span className="text-muted-foreground/50">History</span>
          </h1>
          <p className="admin-subtitle">
            Manage your shop orders
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
          <div className="bg-muted px-6 py-3 md:py-4 rounded-2xl border border-border flex items-center justify-between md:justify-start gap-4">
            <span className="text-[9px] md:text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">
              Total Orders
            </span>
            <span className="text-xl md:text-2xl font-black text-foreground leading-none">
              {total || 0}
            </span>
          </div>
          <Button asChild className="bg-foreground text-background hover:bg-primary hover:text-white h-12 md:h-16 px-8 md:px-10 rounded-xl md:rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 group">
            <Link href="/admin/orders/new">
              <Plus size={18} className="mr-3 transition-transform group-hover:rotate-90" /> Create New Order
            </Link>
          </Button>
        </div>
      </div>

      <div className="admin-table-form">
        <OrdersSearchAndFilter
          status={status}
          onStatusChange={handleFilterStatusChange}
          search={search}
          onSearchChange={handleSearch}
          sort={sort}
          onSortChange={setSort}
        />

        <div className="relative pt-0">
          {isLoading ? (
            <div className="p-8">
              <TableSkeleton rowCount={10} colCount={6} />
            </div>
          ) : (
            <OrdersTable
              orders={orders || []}
              page={page}
              pages={pages}
              onPageChange={setPage}
              isAllFetching={isAllFetching}
              onQuickStatusUpdate={handleQuickStatusUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
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
