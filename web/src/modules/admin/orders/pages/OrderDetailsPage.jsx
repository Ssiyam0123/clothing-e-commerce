"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useAdminOrders } from "@/modules/admin/orders/lib/useAdminOrders";
import { swalConfirm, swalToast, swalError } from "@/utils/swal";
import Loader from "@/components/common/Loader";
import { Zap, Truck, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Domain modular components
import OrderItemsManifest from "../components/OrderItemsManifest";
import CustomerIntelligenceCard from "../components/CustomerIntelligenceCard";
import PaymentDetailsCard from "../components/PaymentDetailsCard";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const {
    orderDetails: order,
    orderDetailsLoading,
    updateOrder,
    syncToPathao,
  } = useAdminOrders({}, id);
  const [syncing, setSyncing] = useState(false);

  const customerName = useMemo(
    () => order?.user?.name || order?.shippingAddress?.name || "Unknown Guest",
    [order],
  );
  const customerEmail = useMemo(
    () => order?.user?.email || order?.shippingAddress?.email || "N/A",
    [order],
  );
  const isRegistered = !!order?.user;

  const handleStatusUpdate = async (newStatus) => {
    const confirmed = await swalConfirm(
      "Update Status?",
      `Mark this order as ${newStatus}?`,
    );
    if (confirmed) {
      try {
        await updateOrder({ id: order._id, data: { orderStatus: newStatus } });
        swalToast(`Order updated to ${newStatus}`);
      } catch (err) {
        swalError("Update Failed", err.response?.data?.message);
      }
    }
  };

  const handlePathaoSync = async () => {
    const confirmed = await swalConfirm(
      "Sync to Pathao?",
      "This will create a live consignment in Pathao.",
    );
    if (confirmed) {
      try {
        setSyncing(true);
        await syncToPathao(order._id);
        swalToast("Synced with Pathao!");
      } catch (err) {
        swalError(
          "Sync Failed",
          err.response?.data?.message || "Check Pathao IDs.",
        );
      } finally {
        setSyncing(false);
      }
    }
  };

  if (orderDetailsLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader />
      </div>
    );
  if (!order)
    return (
      <div className="p-20 text-center uppercase font-black text-muted-foreground bg-background">
        Order not found
      </div>
    );

  const statusVariants = {
    Delivered: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20",
    Cancelled: "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20",
    Pending: "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20",
    Processing: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 hover:bg-indigo-500/20",
    Shipped: "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20",
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-32 px-4 sm:px-10 pt-10 animate-in fade-in duration-700">
      {/* 🧭 NAVIGATION & ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-card p-8 rounded-[2.5rem] border border-border shadow-sm">
        <div className="space-y-2">
          <Link
            href="/admin/orders"
            className="text-[10px] font-black text-muted-foreground hover:text-primary uppercase tracking-[0.3em] flex items-center gap-2 transition-all group"
          >
            <ChevronLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Orders History
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter uppercase italic">
              #{order._id.slice(-8)}
            </h1>
            <Badge
              variant="outline"
              className={cn("px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all", statusVariants[order.orderStatus])}
            >
              {order.orderStatus}
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            asChild
            variant="outline"
            className="h-14 border-border bg-muted/30 hover:bg-foreground hover:text-background rounded-2xl px-8 text-[10px] font-black uppercase tracking-widest transition-all"
          >
            <Link href={`/admin/orders/${id}/edit`}>
              Edit Order
            </Link>
          </Button>

          <Select
            value={order.orderStatus}
            onValueChange={handleStatusUpdate}
          >
            <SelectTrigger className="w-[180px] h-14 bg-muted/50 border-border rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest outline-none transition-all focus:ring-2 focus:ring-primary/20">
              <SelectValue placeholder="Update Status" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border rounded-2xl p-2">
              {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map(
                (s) => (
                  <SelectItem key={s} value={s} className="rounded-xl py-2 px-4 font-black text-[9px] uppercase tracking-widest focus:bg-primary focus:text-primary-foreground cursor-pointer">
                    {s}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>

          {order.pathaoConsignmentId ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-8 py-4 rounded-2xl flex items-center gap-3">
              <Truck size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Pathao: {order.pathaoConsignmentId}
              </span>
            </div>
          ) : (
            <Button
              onClick={handlePathaoSync}
              disabled={
                syncing ||
                ["Cancelled", "Delivered"].includes(order.orderStatus)
              }
              className="bg-foreground text-background hover:bg-primary hover:text-primary-foreground px-10 py-7 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all disabled:opacity-50 shadow-xl flex items-center gap-3"
            >
              {syncing ? (
                <Loader size="small" />
              ) : (
                <>
                  <Zap size={16} fill="currentColor" /> Sync Pathao
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 📦 LEFT: Manifest (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          <OrderItemsManifest order={order} />
        </div>

        {/* 📋 RIGHT: Intelligence (4 Cols) */}
        <div className="lg:col-span-4 space-y-8">
          <CustomerIntelligenceCard
            order={order}
            customerName={customerName}
            customerEmail={customerEmail}
            isRegistered={isRegistered}
          />

          <PaymentDetailsCard order={order} />
        </div>
      </div>
    </div>
  );
}
