"use client";

import { useState } from "react";
import { useAdminFlashSales } from "@/modules/admin/hooks/useAdminFlashSales";
import Link from "next/link";
import { swalConfirm, swalToast, swalError } from "@/utils/swal";
import CountdownTimer from "@/modules/client/common/components/CountdownTimer";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Zap, 
  Clock, 
  Package, 
  Power,
  BarChart3,
  Timer
} from "lucide-react";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const StatusBadge = ({ status }) => {
  const styles = {
    active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    inactive: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
  };
  const text = {
    active: "● ACTIVE",
    pending: "◐ UPCOMING",
    inactive: "○ FINISHED",
  };
  return (
    <Badge variant="outline" className={cn("px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em]", styles[status])}>
      {text[status]}
    </Badge>
  );
};

import { useFilters } from "@/modules/client/common/lib/useFilters";
import Pagination from "@/components/common/Pagination";

export default function AdminFlashSales() {
  const { page, setPage, queryParams } = useFilters({ initialLimit: 30 });
  const { flashSales, total, pages, isLoading, updateFlashSale, deleteFlashSale } = useAdminFlashSales(queryParams);

  const handleToggleActive = async (saleId, currentActive) => {
    try {
      await updateFlashSale({ id: saleId, data: { isActive: !currentActive } });
      swalToast(`Sale ${!currentActive ? "Activated" : "Deactivated"}`, "success");
    } catch (err) {
      swalError("Error", "Could not update sale status.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await swalConfirm(
      "Delete Sale?",
      "Are you sure you want to delete this sale? This action cannot be undone."
    );
    if (confirmed) {
      try {
        await deleteFlashSale(id);
        swalToast("Sale Deleted", "success");
      } catch (err) {
        swalError("Error", "Could not delete sale.");
      }
    }
  };

  return (
    <div className="admin-page-container">
      {/* 🛰️ System Header */}
      <div className="admin-section-header">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
             <Badge variant="outline" className="text-[8px] md:text-[9px] uppercase tracking-widest border-rose-600/30 text-rose-600 bg-rose-600/5 px-3 py-1">Sales</Badge>
          </div>
          <h1 className="admin-title">
            Flash <span className="text-rose-600">Sales</span>
          </h1>
          <p className="admin-subtitle">
            Manage your storefront flash sales • Total: {total}
          </p>
        </div>

        <Button
          asChild
          className="bg-foreground text-background hover:bg-rose-600 hover:text-white h-12 md:h-16 px-8 md:px-10 rounded-xl md:rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 group w-full md:w-auto"
        >
          <Link href="/admin/flash-sales/new">
            <Plus size={18} className="mr-3 transition-transform group-hover:rotate-90" /> Create Sale
          </Link>
        </Button>
      </div>

      {/* 📊 High-Performance Grid */}
      <div className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {isLoading ? (
            [1, 2, 3].map((n) => (
              <Card key={n} className="rounded-[2.5rem] border-border/10 bg-card/20 min-h-[350px] md:min-h-[450px] overflow-hidden">
                <CardContent className="p-10 space-y-8">
                    <div className="flex justify-between items-start">
                      <Skeleton className="h-20 w-20 rounded-2xl" />
                      <Skeleton className="h-8 w-32 rounded-full" />
                    </div>
                    <Skeleton className="h-10 w-full rounded-xl" />
                    <div className="space-y-3">
                      <Skeleton className="h-14 w-full rounded-2xl" />
                      <Skeleton className="h-14 w-full rounded-2xl" />
                    </div>
                </CardContent>
              </Card>
            ))
          ) : flashSales?.length === 0 ? (
            <Card className="col-span-full border-dashed border-border/20 bg-accent/5 rounded-[3rem] py-32 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mb-8 opacity-20">
                <Zap size={48} className="text-rose-600" />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">No Flash Sales Found</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground italic">Create a new flash sale to offer limited-time discounts.</p>
            </Card>
          ) : (
            flashSales.map((sale) => {
              const now = new Date();
              const start = new Date(sale.startDate);
              const end = new Date(sale.endDate);
              let status;
              if (!sale.isActive || now > end) status = "inactive";
              else if (now < start) status = "pending";
              else status = "active";

              return (
                <Card key={sale._id} className="group rounded-[2.5rem] border-border/10 bg-card/30 backdrop-blur-xl shadow-xl hover:shadow-rose-600/5 transition-all duration-700 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/5 blur-3xl rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  
                  <CardHeader className="p-10 pb-0">
                    <div className="flex justify-between items-start mb-8">
                      <div className="bg-rose-600 text-white w-20 h-20 rounded-[1.5rem] flex flex-col items-center justify-center shadow-[0_10px_30px_rgba(225,29,72,0.3)] transform -rotate-6 group-hover:rotate-0 transition-transform duration-700">
                        <span className="text-3xl font-black italic">{sale.discount}%</span>
                        <span className="text-[8px] font-black uppercase tracking-widest -mt-1">OFF</span>
                      </div>
                      <div className="flex flex-col items-end gap-4">
                        <StatusBadge status={status} />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleActive(sale._id, sale.isActive)}
                          className={cn(
                            "h-10 px-5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all",
                            sale.isActive 
                              ? "bg-foreground text-background border-transparent hover:bg-rose-600 hover:text-white"
                              : "bg-accent/10 border-border/20 text-muted-foreground hover:border-rose-600/50 hover:text-rose-600"
                          )}
                        >
                          <Power size={12} className="mr-2" />
                          {sale.isActive ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-black uppercase tracking-tighter leading-tight group-hover:text-rose-600 transition-colors duration-500">
                      {sale.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-10 space-y-6">
                    {status === "pending" && (
                      <div className="p-6 bg-accent/5 rounded-[1.5rem] border border-border/5 flex flex-col items-center gap-4">
                        <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest italic flex items-center gap-2">
                          <Timer size={12} /> Starting Soon
                        </span>
                        <CountdownTimer targetDate={start} />
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-3">
                      <DataPoint icon={<Clock size={14} />} label="Starts" value={start.toLocaleString([], { dateStyle: "medium", timeStyle: "short" })} />
                      <DataPoint icon={<BarChart3 size={14} />} label="Ends" value={end.toLocaleString([], { dateStyle: "medium", timeStyle: "short" })} />
                      <DataPoint icon={<Package size={14} />} label="Products" value={`${sale.products?.length || 0} Items`} />
                    </div>

                    <div className="pt-8 border-t border-border/5 flex items-center gap-4">
                      <Button asChild variant="outline" className="flex-1 h-12 rounded-xl border-border/10 text-[10px] font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all">
                        <Link href={`/admin/flash-sales/${sale._id}`}>
                          <Edit3 size={14} className="mr-2" /> Edit
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleDelete(sale._id)}
                        className="h-12 w-12 rounded-xl border-border/10 hover:border-rose-600/50 hover:bg-rose-600 hover:text-white transition-all"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-center pt-8 border-t border-border/5">
            <Pagination 
              page={page} 
              totalPages={pages} 
              onPageChange={setPage} 
              className="py-0" 
            />
          </div>
        )}
      </div>
    </div>
  );
}

function DataPoint({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-accent/5 border border-border/5 group/point hover:bg-accent/10 transition-colors">
       <div className="flex items-center gap-4">
          <div className="p-2 rounded-lg bg-background text-muted-foreground group-hover/point:text-rose-600 transition-colors">
             {icon}
          </div>
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</span>
       </div>
       <span className="text-[11px] font-bold uppercase tracking-tight text-foreground">{value}</span>
    </div>
  );
}
