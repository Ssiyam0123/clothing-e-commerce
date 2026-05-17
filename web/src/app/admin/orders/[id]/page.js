"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useAdminOrders } from "@/modules/admin/hooks/useAdminOrders";
import { swalConfirm, swalToast, swalError } from "@/utils/swal";
import Loader from "@/components/common/Loader";
import { getImageUrl } from "@/utils/imageUtils";
import {
  Zap,
  Package,
  Truck,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

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
          <Card className="rounded-[2.5rem] border-border bg-card p-4 md:p-8 shadow-sm">
            <CardHeader className="px-4 pb-10">
              <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] border-b border-border pb-4">
                01. Products Ordered
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 px-4">
              {order.orderItems.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row items-center gap-8 p-6 rounded-3xl bg-muted/30 border border-border/50 group transition-all hover:bg-muted/50"
                >
                  <div className="h-32 w-24 bg-muted rounded-2xl overflow-hidden shrink-0 border border-border shadow-inner">
                    <img
                      src={getImageUrl(item.image || item.product?.images?.[0])}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      alt={item.name}
                    />
                  </div>
                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <p className="font-black text-foreground uppercase tracking-tight text-xl italic">
                      {item.name}
                    </p>
                    <p className="text-[9px] font-black text-primary uppercase tracking-widest">
                      Price per unit: ৳{item.price}
                    </p>
                  </div>
                  <div className="flex items-center gap-10">
                    <div className="text-center">
                      <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
                        Quantity
                      </p>
                      <p className="text-3xl font-black text-foreground">
                        ×{item.quantity}
                      </p>
                    </div>
                    <div className="text-right min-w-[100px]">
                      <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
                        Subtotal
                      </p>
                      <p className="text-2xl font-black text-foreground tracking-tighter">
                        ৳{(item.price * item.quantity).toFixed(0)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* FINANCIAL SUMMARY */}
              <div className="mt-12 pt-10 border-t border-border flex flex-col md:flex-row justify-between gap-10">
                <div className="space-y-4 flex-1">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="text-foreground">
                      ৳{order.itemsPrice?.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <span>Delivery Charge</span>
                    <span className="text-foreground">
                      ৳{order.shippingPrice?.toFixed(0)}
                    </span>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-emerald-500">
                      <span>Voucher Discount</span>
                      <span>- ৳{order.discountAmount.toFixed(0)}</span>
                    </div>
                  )}
                </div>
                <div className="md:text-right md:border-l border-border md:pl-12">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-2">
                    Grand Total
                  </p>
                  <p className="text-6xl md:text-7xl font-black text-foreground tracking-tighter leading-none italic">
                    ৳{order.totalPrice.toFixed(0)}
                  </p>
                  <div className="flex items-center md:justify-end gap-2 mt-4 text-[10px] font-black uppercase text-muted-foreground">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    Secured by {order.paymentMethod}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 📋 RIGHT: Intelligence (4 Cols) */}
        <div className="lg:col-span-4 space-y-8">
          {/* CUSTOMER INTELLIGENCE */}
          <Card className="rounded-[2.5rem] border-border bg-card p-8 shadow-sm">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-8">
              02. Account Holder
            </h3>
            <div className="flex items-center gap-5 mb-10">
              <div className="h-20 w-20 rounded-[2rem] bg-muted flex items-center justify-center font-black text-muted-foreground border border-border text-3xl shadow-inner overflow-hidden uppercase">
                {order.user?.avatar ? (
                  <img
                    src={getImageUrl(order.user.avatar)}
                    className="w-full h-full object-cover grayscale"
                  />
                ) : (
                  customerName.charAt(0)
                )}
              </div>
              <div>
                <p className="font-black text-2xl text-foreground uppercase tracking-tighter italic leading-tight">
                  {customerName}
                </p>
                <Badge
                  variant="outline"
                  className={cn("text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border mt-1", isRegistered ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground border-border")}
                >
                  {isRegistered ? "Registered User" : "Guest User"}
                </Badge>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Mail size={16} className="text-muted-foreground mt-1" />
                <div>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                    Email Address
                  </p>
                  <p className="text-xs font-bold text-foreground break-all">
                    {customerEmail}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone size={16} className="text-muted-foreground mt-1" />
                <div>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                    Phone Number
                  </p>
                  <p className="text-xs font-bold text-foreground">
                    {order.shippingAddress.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin size={16} className="text-muted-foreground mt-1" />
                <div>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                    Delivery Address
                  </p>
                  <p className="text-xs font-bold text-foreground leading-relaxed uppercase">
                    <span className="text-[10px] text-muted-foreground mr-2 font-black italic underline decoration-blue-600/30">Recipient:</span> {order.shippingAddress.name}
                  </p>
                  <p className="text-xs font-bold text-foreground leading-relaxed uppercase mt-1">
                    {order.shippingAddress.address}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* PAYMENT METADATA */}
          <Card className="bg-muted/30 rounded-[2.5rem] border-border p-8 shadow-inner">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-6">
              03. Payment Details
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-[10px] font-black text-muted-foreground uppercase">
                  Payment Status
                </span>
                <div className="flex items-center gap-2">
                  <div
                    className={cn("w-2 h-2 rounded-full animate-pulse", order.paymentResult?.status === "Completed" ? "bg-emerald-500" : "bg-amber-500")}
                  />
                  <span
                    className={cn("text-[10px] font-black uppercase", order.paymentResult?.status === "Completed" ? "text-emerald-500" : "text-amber-500")}
                  >
                    {order.paymentResult?.status || "In Transit"}
                  </span>
                </div>
              </div>
              {order.paymentResult?.transactionId && (
                <div className="pt-2">
                  <p className="text-[9px] font-black text-muted-foreground uppercase mb-2">
                    Transaction ID
                  </p>
                  <p className="font-mono text-[10px] font-bold text-foreground break-all bg-card p-4 rounded-2xl border border-border">
                    {order.paymentResult.transactionId}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
