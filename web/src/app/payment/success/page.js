"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useOrders } from "@/hooks/useOrders";
import { getImageUrl } from "@/utils/imageUtils";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
} from "lucide-react";
import Loader from "@/components/common/Loader";
import { useProductStore } from "@/store/productStore";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  const { orderDetails: order, orderDetailsLoading: isLoading } = useOrders(
    {},
    orderId,
  );
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
      <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-[#050505]">
        <Loader />
      </div>
    );
  }

  if (!order)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center  font-black uppercase tracking-widest">
        <ShieldCheck size={48} className="mb-4 text-muted" />
        Order Protocol Not Found
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#050505] py-20 px-4 md:px-10">
      <div className="max-w-[1200px] mx-auto">
        {/* Cinematic Header */}
        <header className="text-center mb-20">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            className="w-28 h-28 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-emerald-500/20"
          >
            <CheckCircle2 size={56} className="text-primary" />
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic mb-4  leading-none">
            Verified.
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-muted">
            Settlement Protocol Synchronized Successfully
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Manifest Summary */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-surface dark:bg-accent-primary/40 p-8 md:p-12 rounded-[3.5rem] border shadow-sm">
              <div className="flex justify-between items-end mb-10 border-b pb-6">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary text-left">
                  01. Artifact Manifest
                </h2>
                <span className="text-[9px] font-black  opacity-40">
                  ID: {order._id?.slice(-8).toUpperCase()}
                </span>
              </div>

              <div className="space-y-8">
                {order.orderItems?.map((item, idx) => (
                  <div key={idx} className="flex gap-6 items-center group">
                    <div className="w-20 h-24 bg-elevated dark:bg-elevated rounded-2xl overflow-hidden shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-500">
                      <img
                        src={getImageUrl(item.product?.images?.[0])}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        alt=""
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-black uppercase text-primary leading-tight">
                        {item.product?.name}
                      </p>
                      <p className="text-[9px] text-muted font-bold mt-1.5 uppercase tracking-widest">
                        Architecture: {item.size?.name || "Standard"}
                      </p>
                      <p className="text-[9px] text-muted font-bold uppercase tracking-widest">
                        Sequence: {item.quantity}
                      </p>
                    </div>
                    <p className="text-lg font-black tracking-tighter ">
                      ৳{(item.price * item.quantity).toFixed(0)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-10 border-t space-y-4">
                <div className="flex justify-between text-[10px] font-black text-muted uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>৳{order.itemsPrice}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-[10px] font-black text-rose-500 uppercase tracking-widest">
                    <span>Discount Protocol</span>
                    <span>- ৳{order.discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-[10px] font-black text-muted uppercase tracking-widest">
                  <span>Logistics Fee</span>
                  <span>৳{order.shippingPrice}</span>
                </div>
                <div className="flex justify-between items-end pt-6">
                  <span className="text-xs font-black text-primary uppercase tracking-[0.4em]">
                    Investment Paid
                  </span>
                  <span className="text-5xl font-black tracking-tighter  italic leading-none">
                    ৳{order.totalPrice}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Logistics & Action Hub */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-accent-primary text-primary p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
              <Truck className="absolute -right-8 -bottom-8 w-40 h-40 opacity-5 group-hover:rotate-12 transition-transform duration-1000" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary mb-8 flex items-center gap-3">
                02. Logistics Hub
              </h3>
              <div className="space-y-4 relative z-10">
                <p className="text-sm font-black uppercase tracking-tight italic">
                  {order.shippingAddress?.name}
                </p>
                <p className="text-[10px] text-muted uppercase leading-relaxed font-medium tracking-widest">
                  {order.shippingAddress?.street},<br />
                  {order.shippingAddress?.city}
                </p>
                <div className="pt-4">
                  <span className="px-4 py-2 bg-surface rounded-full text-[10px] font-black text-indigo-400 tracking-widest border border-white/5">
                    {order.shippingAddress?.phone}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <button
                onClick={() => router.push("/profile?tab=orders")}
                className="w-full bg-accent-primary text-primary  py-7 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-accent-secondary hover:text-primary transition-all shadow-xl"
              >
                <Package size={18} /> Track Sequence <ArrowRight size={14} />
              </button>
              <button
                onClick={() => router.push("/products")}
                className="w-full bg-elevated dark:bg-accent-primary/50 text-secondary py-7 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 hover:text-primary dark:hover:text-primary transition-all"
              >
                <ShoppingBag size={18} /> Continue Acquisition
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
        <div className="h-screen flex items-center justify-center bg-surface dark:bg-[#050505]">
          <Loader />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
