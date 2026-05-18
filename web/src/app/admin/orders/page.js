"use client";

import { useState, useCallback, Suspense, useMemo } from "react";
import { useAdminOrders } from "@/app/admin/orders/lib/useAdminOrders";
import { useFilters } from "@/app/admin/_hooks/useFilters";
import TableSkeleton from "@/components/common/TableSkeleton";
import OrdersSearchAndFilter from "./components/OrdersSearchAndFilter";
import OrdersTable from "./components/OrdersTable";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import AdminPageHeader, {
  AdminHeaderButton,
  AdminHeaderStat,
} from "@/app/admin/_components/AdminPageHeader";

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
      <AdminPageHeader
        title="Orders"
        description="View and manage customer orders."
        actions={
          <>
            <AdminHeaderStat label="Total orders" value={total || 0} />
            <AdminHeaderButton href="/admin/orders/new" icon={Plus}>
              Create order
            </AdminHeaderButton>
          </>
        }
      />

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
          <Skeleton className="mb-8 h-24 w-full rounded-xl" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-24 rounded-full" />
            ))}
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
