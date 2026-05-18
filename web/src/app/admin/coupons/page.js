"use client";

import Link from "next/link";
import { useAdminCoupons } from "@/app/admin/coupons/lib/useAdminCoupons";
import DataTable from "@/app/admin/_components/DataTable";
import TableSkeleton from "@/components/common/TableSkeleton";
import { swalConfirm, swalToast, swalError } from "@/utils/swal";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Ticket, 
  Power,
  Eye
} from "lucide-react";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { useFilters } from "@/app/admin/_hooks/useFilters";
import Pagination from "@/components/common/Pagination";
import AdminPageHeader, { AdminHeaderButton } from "@/app/admin/_components/AdminPageHeader";

export default function CouponListPage() {
  const { page, setPage, queryParams } = useFilters({ initialLimit: 30 });
  const { coupons, total, pages, isLoading, deleteCoupon, updateCoupon } = useAdminCoupons(queryParams);

  const handleDelete = async (id) => {
    const confirmed = await swalConfirm(
      "Deactivate Protocol?",
      "This coupon will be permanently deleted."
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
           <div className={cn(
             "w-10 h-10 rounded-xl flex items-center justify-center relative",
             item.isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
           )}>
              <Ticket size={20} />
              <div className={cn(
                "absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-background",
                item.isActive ? "bg-emerald-500" : "bg-rose-500"
              )} />
           </div>
           <span className={cn(
             "font-black px-4 py-2 rounded-xl border uppercase tracking-[0.2em] text-[10px] shadow-sm",
             item.isActive ? "text-emerald-600 bg-emerald-600/5 border-emerald-600/10" : "text-rose-600 bg-rose-600/5 border-rose-600/10"
           )}>
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
      label: "Command Ops",
      render: (item) => (
        <div className="flex items-center gap-3 justify-end">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={async () => {
              try {
                await updateCoupon({ id: item._id, data: { isActive: !item.isActive } });
                swalToast(`Voucher ${item.isActive ? 'Deactivated' : 'Activated'}`, "success");
              } catch (err) {
                swalError("Action Rejected", "Neural override failed.");
              }
            }}
            className={cn(
              "h-10 w-10 rounded-xl border-border/10 transition-all active:scale-95 group",
              item.isActive 
                ? "bg-rose-500/10 text-rose-600 hover:bg-rose-600 hover:text-white" 
                : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-600 hover:text-white"
            )}
            title={item.isActive ? "Deactivate Coupon" : "Activate Coupon"}
          >
            <Power size={16} className="transition-transform group-hover:scale-110" />
          </Button>
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
      <AdminPageHeader
        title="Coupons"
        description={`Manage discount codes · ${total || 0} coupons`}
        actions={
          <AdminHeaderButton href="/admin/coupons/new" icon={Plus}>
            Add coupon
          </AdminHeaderButton>
        }
      />

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



