"use client";

import Link from "next/link";
import { Eye, Edit2 } from "lucide-react";
import DataTable from "@/app/admin/_components/DataTable";
import Pagination from "@/components/common/Pagination";
import { cn } from "@/lib/utils";

export default function OrdersTable({
  orders,
  page,
  pages,
  onPageChange,
  isAllFetching,
  onQuickStatusUpdate,
}) {
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
            {item?.shippingAddress?.phone || "N/A"}
          </p>
        </div>
      ),
    },
    {
      label: "Date & Time",
      render: (item) => {
        const dateObj = item.createdAt ? new Date(item.createdAt) : null;
        const isValid = dateObj && !isNaN(dateObj.getTime());
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-black text-foreground uppercase tracking-tighter leading-none">
              {isValid
                ? dateObj.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "N/A"}
            </span>
            {isValid && (
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.1em]">
                {dateObj.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
            )}
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
          onChange={(e) => onQuickStatusUpdate(item._id, e.target.value)}
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
            title="View Details"
          >
            <Eye size={16} className="group-hover:scale-110 transition-transform" />
          </Link>
          <Link
            href={`/admin/orders/${item._id}/edit`}
            className="p-2.5 bg-indigo-600/10 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-all shadow-sm border border-border/10 group"
            title="Edit Order"
          >
            <Edit2 size={16} className="group-hover:scale-110 transition-transform" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div
      className={`transition-opacity duration-300 ${isAllFetching ? "opacity-50 pointer-events-none" : "opacity-100"}`}
    >
      <DataTable columns={columns} data={orders || []} className="border-none rounded-none" />

      {pages > 1 && (
        <div className="p-8 border-t border-border/10 bg-background/5">
          <Pagination
            page={page}
            totalPages={pages}
            onPageChange={onPageChange}
            className="py-0 sm:py-0 justify-between flex-row-reverse"
          />
        </div>
      )}
    </div>
  );
}
