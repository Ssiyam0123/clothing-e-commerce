"use client";

import Link from "next/link";
import { useCoupons } from "@/hooks/useCoupons";
import DataTable from "@/components/admin/DataTable";
import TableSkeleton from "@/components/common/TableSkeleton";
import { swalConfirm, swalToast, swalError } from "@/utils/swal";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Ticket, 
  Activity, 
  BarChart, 
  History,
  ShieldCheck,
  Power,
  Eye
} from "lucide-react";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { useFilters } from "@/hooks/useFilters";
import Pagination from "@/components/common/Pagination";

export default function CouponArchive() {
  const { page, setPage, queryParams } = useFilters({ initialLimit: 30 });
  const { coupons, total, pages, isLoading, deleteCoupon } = useCoupons(queryParams);

  const handleDelete = async (id) => {
    const confirmed = await swalConfirm(
      "Deactivate Protocol?",
      "This coupon will be purged from the settlement engine."
    );
    if (confirmed) {
      try {
        await deleteCoupon(id);
        swalToast("Voucher Purged", "success");
      } catch (err) {
        swalError("Action Rejected", "Voucher is currently linked to active order sequences.");
      }
    }
  };

  const columns = [
    {
      label: "Voucher Identity",
      render: (item) => (
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
              <Ticket size={20} />
           </div>
           <span className="font-black text-indigo-600 bg-indigo-600/5 px-4 py-2 rounded-xl border border-indigo-600/10 uppercase tracking-[0.2em] text-[10px] shadow-sm">
             {item.code}
           </span>
        </div>
      ),
    },
    {
      label: "Benefit Logic",
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-black text-foreground uppercase tracking-tight text-xs">
            {item.discountType === "percentage"
              ? `${item.discountValue}% Reduction`
              : `৳${item.discountValue} Flat Credit`}
          </span>
          <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mt-1">
            {item.discountType === "percentage" ? "Relative Scale" : "Absolute Value"}
          </span>
        </div>
      ),
    },
    {
      label: "Neural Load",
      render: (item) => {
        const usagePercent = Math.min((item.usedCount / (item.usageLimit || 100)) * 100, 100);
        return (
          <div className="flex flex-col gap-2 w-32">
            <div className="flex justify-between items-center">
               <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">
                 Load: {item.usedCount}/{item.usageLimit || "∞"}
               </span>
               <span className="text-[9px] font-bold text-indigo-600 italic">
                 {Math.round(usagePercent)}%
               </span>
            </div>
            <div className="w-full h-1.5 bg-accent/20 rounded-full overflow-hidden shadow-inner">
              <div
                className={cn(
                  "h-full transition-all duration-1000 ease-out",
                  usagePercent > 80 ? "bg-rose-500 shadow-[0_0_10px_rgba(225,29,72,0.5)]" : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                )}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      label: "Operational Status",
      render: (item) => {
        const now = new Date();
        const start = new Date(item.startDate);
        const end = item.endDate ? new Date(item.endDate) : null;

        let status = {
          label: "● Active",
          style: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        };
        if (!item.isActive)
          status = {
            label: "○ Disabled",
            style: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
          };
        else if (now < start)
          status = {
            label: "◐ Pending",
            style: "bg-amber-500/10 text-amber-500 border-amber-500/20",
          };
        else if (end && now > end)
          status = {
            label: "× Expired",
            style: "bg-rose-500/10 text-rose-500 border-rose-500/20",
          };

        return (
          <Badge
            variant="outline"
            className={cn("px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em]", status.style)}
          >
            {status.label}
          </Badge>
        );
      },
    },
    {
      label: "Command Ops",
      render: (item) => (
        <div className="flex items-center gap-3 justify-end">
          <Button 
            asChild 
            variant="outline" 
            size="icon" 
            className="h-10 w-10 rounded-xl border-border/10 hover:border-blue-600/50 hover:bg-blue-600 hover:text-white bg-background/50 transition-all active:scale-95 group"
          >
            <Link href={`/admin/coupons/${item._id}`}>
              <Eye size={16} className="group-hover:scale-110 transition-transform" />
            </Link>
          </Button>
          <Button 
            asChild 
            variant="outline" 
            size="icon" 
            className="h-10 w-10 rounded-xl border-border/10 hover:border-indigo-600/50 hover:bg-indigo-600 hover:text-white bg-background/50 transition-all active:scale-95"
          >
            <Link href={`/admin/coupons/${item._id}/edit`}>
              <Edit3 size={16} />
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleDelete(item._id)}
            className="h-10 w-10 rounded-xl border-border/10 hover:border-rose-600/50 hover:bg-rose-600 hover:text-white bg-background/50 transition-all active:scale-95"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="admin-page-container">
      {/* 🛰️ Tactical Header */}
      <div className="admin-section-header">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
             <Badge variant="outline" className="text-[8px] md:text-[9px] uppercase tracking-widest border-emerald-600/30 text-emerald-600 bg-emerald-600/5 px-3 py-1">Settlement Hub</Badge>
          </div>
          <h1 className="admin-title">
            Voucher <span className="text-emerald-600">Hub</span>
          </h1>
          <p className="admin-subtitle">
            Logic Orchestration • Total Logs: {total}
          </p>
        </div>

        <Button
          asChild
          className="bg-foreground text-background hover:bg-emerald-600 hover:text-white h-12 md:h-16 px-8 md:px-10 rounded-xl md:rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 group w-full md:w-auto"
        >
          <Link href="/admin/coupons/new">
            <Plus size={18} className="mr-3 transition-transform group-hover:rotate-90" /> Initialize Voucher
          </Link>
        </Button>
      </div>

      {/* 📊 Intelligence Ledger */}
      <div className="admin-table-form">
        <div className="pt-0">
          {isLoading ? (
            <div className="p-8">
              <TableSkeleton rowCount={6} />
            </div>
          ) : (
            <>
              <DataTable 
                columns={columns} 
                data={coupons} 
                className="bg-transparent border-none rounded-none" 
              />
              
              {/* Pagination */}
              <div className="p-8 border-t border-border/10 bg-background/5">
                <Pagination 
                  page={page} 
                  totalPages={pages} 
                  onPageChange={setPage} 
                  className="py-0 sm:py-0 justify-between flex-row-reverse" 
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
