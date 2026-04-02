"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useOrders } from "@/hooks/useOrders";
import { getImageUrl } from "@/utils/imageUtils";
import { motion } from "framer-motion";
import { CheckCircle2, Package, Truck, ArrowRight, ShoppingBag } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId"); // গেটওয়ে থেকে আসা আইডি
  
  const { orderDetails: order, orderDetailsLoading: isLoading } = useOrders({}, orderId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
        <div className="animate-pulse text-zinc-800 font-black text-4xl italic">VANGUARD</div>
      </div>
    );
  }

  if (!order) return <div className="text-center py-20 font-black uppercase text-zinc-400">Order Protocol Not Found</div>;

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#050505] py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <header className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }} 
            className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/20"
          >
            <CheckCircle2 size={48} className="text-white" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4 dark:text-white">Success!</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">Protocol Synchronized Successfully</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Summary Section */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-white/5 p-8 rounded-[3rem]">
              <h2 className="text-xs font-black uppercase tracking-widest mb-8 border-b dark:border-white/5 pb-4 text-zinc-400">Order Summary</h2>
              <div className="space-y-6">
                {order.orderItems?.map((item, idx) => (
                  <div key={idx} className="flex gap-6 items-center">
                    <div className="w-16 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-2xl overflow-hidden shrink-0">
                      <img src={getImageUrl(item.product?.images?.[0])} className="w-full h-full object-cover grayscale" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] font-black uppercase text-zinc-900 dark:text-white">{item.product?.name}</p>
                      <p className="text-[9px] text-zinc-500 font-bold mt-1 uppercase tracking-widest">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-black tracking-tighter text-zinc-900 dark:text-white">৳{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t dark:border-white/5 space-y-3">
                <div className="flex justify-between text-[10px] font-black text-zinc-500 uppercase tracking-widest"><span>Subtotal</span><span>৳{order.itemsPrice}</span></div>
                {order.discountAmount > 0 && <div className="flex justify-between text-[10px] font-black text-emerald-500 uppercase tracking-widest"><span>Discount</span><span>- ৳{order.discountAmount}</span></div>}
                <div className="flex justify-between text-[10px] font-black text-zinc-500 uppercase tracking-widest"><span>Shipping</span><span>৳{order.shippingPrice}</span></div>
                <div className="flex justify-between items-center pt-4"><span className="text-xs font-black text-zinc-400 uppercase tracking-[0.3em]">Total Paid</span><span className="text-3xl font-black tracking-tighter dark:text-white">৳{order.totalPrice}</span></div>
              </div>
            </div>
          </div>

          {/* Logistics Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-zinc-900 text-white p-8 rounded-[3rem] shadow-2xl">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-3"><Truck size={14} /> Shipping Protocol</h3>
              <p className="text-xs font-black uppercase mb-1">{order.shippingAddress?.name}</p>
              <p className="text-[10px] text-zinc-400 uppercase leading-relaxed mb-4">{order.shippingAddress?.street}, {order.shippingAddress?.city}</p>
              <p className="text-[10px] font-bold text-indigo-400 tracking-widest">{order.shippingAddress?.phone}</p>
            </div>

            <button 
              onClick={() => router.push('/profile?tab=orders')}
              className="w-full bg-white dark:bg-white text-black py-6 rounded-full font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] transition-all"
            >
              <Package size={16} /> Track Order <ArrowRight size={14} />
            </button>
            <button 
              onClick={() => router.push('/products')}
              className="w-full border-2 border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 py-6 rounded-full font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3"
            >
              <ShoppingBag size={16} /> Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}