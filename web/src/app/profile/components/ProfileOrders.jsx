"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Package } from "lucide-react";
import ProfileOrderCard from "@/app/profile/components/ProfileOrderCard";

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
        <ProfileOrderCard 
          key={order._id} 
          order={order} 
          onOpenDetails={onOpenDetails} 
        />
      ))}
    </motion.div>
  );
}
