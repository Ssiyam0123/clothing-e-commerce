"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useOrders } from "@/hooks/client/useOrders";
import { getImageUrl } from "@/utils/imageUtils";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Package,
  ArrowRight,
  ShoppingBag,
  Clock,
  MapPin,
  FileText
} from "lucide-react";
import Loader from "@/components/common/Loader";
import { useProductStore } from "@/store/productStore";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  const { orderDetails: order, orderDetailsLoading: isLoading } = useOrders(orderId);
  const { clearCart } = useProductStore();

  useEffect(() => {
    if (order && !isLoading) {
      if (order.isDirectBuy) {
        clearCart("direct");
      } else {
        clearCart("all");
      }
    }
  }, [order, isLoading, clearCart]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader />
      </div>
    );
  }

  if (!order)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-sans tracking-tight">
        <Package size={48} className="mb-4 text-muted-foreground opacity-20" />
        <h2 className="text-xl font-bold">Order Not Found</h2>
        <p className="text-sm text-muted-foreground mt-2">We couldn't retrieve your order details.</p>
        <button 
          onClick={() => router.push("/")}
          className="mt-6 px-8 py-3 bg-foreground text-background rounded-full text-xs font-bold uppercase tracking-widest"
        >
          Return Home
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#080808] py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Banner */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full mb-8"
          >
            <CheckCircle2 size={40} />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Thank You for Your Order
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
            Your acquisition sequence is confirmed. We are now preparing your artifacts for delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-[#111] rounded-3xl p-8 shadow-sm border border-border/40">
              <div className="flex items-center justify-between mb-8 pb-6 border-b">
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-muted-foreground" />
                  <span className="text-xs font-bold uppercase tracking-widest">Order Summary</span>
                </div>
                <span className="text-[10px] font-mono bg-accent/10 px-3 py-1 rounded-full">
                  #{order._id?.slice(-8).toUpperCase()}
                </span>
              </div>

              <div className="space-y-6">
                {order.orderItems?.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <div className="w-16 h-20 rounded-xl overflow-hidden bg-accent/5 border shrink-0">
                      <img
                        src={getImageUrl(item.image)}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold uppercase truncate">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground font-medium mt-1 uppercase">
                        Size: {item.size?.name || item.size || "Standard"} • Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-bold">
                      ৳{(item.price * item.quantity).toFixed(0)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t space-y-3">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Subtotal</span>
                  <span>৳{order.itemsPrice}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-500">
                    <span>Discount Applied</span>
                    <span>-৳{order.discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Shipping</span>
                  <span>৳{order.shippingPrice}</span>
                </div>
                <div className="flex justify-between items-center pt-4 text-lg font-black uppercase tracking-tighter">
                  <span>Total Investment</span>
                  <span className="text-2xl">৳{order.totalPrice}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Logistics Summary */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#111] rounded-3xl p-8 shadow-sm border border-border/40">
              <div className="flex items-center gap-3 mb-6">
                <MapPin size={18} className="text-muted-foreground" />
                <span className="text-xs font-bold uppercase tracking-widest">Shipping</span>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase">{order.shippingAddress?.name}</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed uppercase">
                  {order.shippingAddress?.street},<br />
                  {order.shippingAddress?.city}
                </p>
                <p className="text-[10px] font-bold mt-4 text-primary">
                  {order.shippingAddress?.phone}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#111] rounded-3xl p-8 shadow-sm border border-border/40">
              <div className="flex items-center gap-3 mb-6">
                <Clock size={18} className="text-muted-foreground" />
                <span className="text-xs font-bold uppercase tracking-widest">Payment</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase">{order.paymentMethod}</p>
                <p className="text-[10px] text-muted-foreground uppercase">
                  Status: {order.paymentResult?.status || "Processing"}
                </p>
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <button
                onClick={() => router.push("/profile/order")}
                className="w-full py-4 bg-foreground text-background rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                Track Order <ArrowRight size={14} />
              </button>
              <button
                onClick={() => router.push("/products")}
                className="w-full py-4 bg-accent/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-accent/20 transition-all"
              >
                <ShoppingBag size={14} /> Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center bg-background">
          <Loader />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
