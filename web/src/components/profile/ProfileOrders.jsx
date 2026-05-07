"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { getImageUrl } from "@/utils/imageUtils";
import { Badge } from "@/components/ui/badge";
import { Package, Calendar, Tag, CreditCard, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function ProfileOrders({ orders, ui, loading, onOpenDetails }) {
  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-48 w-full bg-accent/20 animate-pulse rounded-[2rem]" />
        ))}
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="py-24 text-center space-y-8 border-2 border-dashed border-border/50 rounded-[3rem] bg-accent/5">
        <div className="w-24 h-24 bg-background rounded-full flex items-center justify-center mx-auto shadow-xl">
           <Package size={40} className="text-muted-foreground/30" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black uppercase tracking-tighter">{ui.noOrders}</h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{ui.noOrdersSub}</p>
        </div>
        <Link href="/products">
           <button className="bg-foreground text-background px-10 py-4 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-accent-secondary hover:text-white transition-all shadow-2xl">
             {ui.startShop}
           </button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {orders.map((order) => (
        <motion.div
          key={order._id}
          variants={item}
          className="group relative bg-background border border-border/50 rounded-[2.5rem] overflow-hidden hover:border-accent-secondary/30 transition-all duration-700 hover:shadow-2xl hover:shadow-accent-secondary/5"
        >
          <div className="p-6 md:p-10 flex flex-col lg:flex-row gap-10">
             {/* Order Identity */}
             <div className="lg:w-1/4 space-y-6">
                <div className="space-y-1">
                   <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">Order Sequence</p>
                   <p className="font-mono text-sm font-bold text-primary">#{order._id.slice(-8).toUpperCase()}</p>
                </div>
                
                <div className="flex items-center gap-3">
                   <Calendar size={14} className="text-accent-secondary" />
                   <span className="text-xs font-bold">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                </div>

                <Badge className={cn(
                  "px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border-none shadow-lg",
                  order.orderStatus === "Delivered" ? "bg-emerald-500 text-white" : 
                  order.orderStatus === "Cancelled" ? "bg-rose-500 text-white" : "bg-amber-500 text-white"
                )}>
                  {order.orderStatus}
                </Badge>
             </div>

             {/* Order Content */}
             <div className="flex-1 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   {order.orderItems.map((product, idx) => (
                     <div key={idx} className="flex gap-5 group/item">
                        <div className="w-20 h-24 rounded-2xl overflow-hidden bg-accent/20 border border-border/10 shrink-0 shadow-lg group-hover/item:scale-105 transition-transform duration-500">
                           <img 
                             src={getImageUrl(product.image)} 
                             alt={product.name} 
                             className="w-full h-full object-cover"
                           />
                        </div>
                        <div className="flex flex-col justify-center gap-1">
                           <h4 className="text-sm font-black uppercase tracking-tight line-clamp-1 group-hover/item:text-accent-secondary transition-colors">{product.name}</h4>
                           <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                              <span>Size: {product.size || 'N/A'}</span>
                              <span className="w-1 h-1 rounded-full bg-border" />
                              <span>Qty: {product.quantity}</span>
                           </div>
                           <p className="text-xs font-black text-primary">৳{(product.price || 0).toFixed(0)}</p>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="h-px w-full bg-border/10" />

                <div className="flex flex-wrap items-center justify-between gap-6">
                   <div className="flex items-center gap-8">
                      <div className="space-y-1">
                         <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                           <CreditCard size={10} /> Settlement
                         </p>
                         <p className="text-xs font-bold uppercase">{order.paymentMethod} <span className="text-[10px] text-muted-foreground/60">({order.paymentResult?.status || 'Unpaid'})</span></p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                           <Tag size={10} /> Total Value
                         </p>
                         <p className="text-lg font-black tracking-tighter text-accent-secondary">৳{(order.totalPrice || 0).toFixed(0)}</p>
                      </div>
                   </div>

                   <button 
                    onClick={() => onOpenDetails(order._id)}
                    className="shrink-0 flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-full border border-border hover:bg-foreground hover:text-background transition-all group/btn shadow-xl shadow-foreground/5"
                   >
                    Details Report
                    <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                   </button>
                </div>
             </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
