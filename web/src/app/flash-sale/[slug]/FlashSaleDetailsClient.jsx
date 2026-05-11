"use client";

import { useAppStore } from "@/store/appStore";
import FlashSaleBanner from "@/components/store/FlashSaleBanner";
import CountdownTimer from "@/components/store/CountdownTimer";
import ProductCard from "@/components/common/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Clock, ShieldCheck, ArrowLeft, Timer, ShoppingBag, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function FlashSaleDetailsClient({ sale }) {
  const { isMounted } = useAppStore();
  const isLive = new Date(sale.startDate) <= new Date();

  if (!isMounted) return null;

  return (
    <main className="min-h-screen bg-background  overflow-x-hidden">
      {/* 🧭 Navigation Header */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-12 mb-8 sm:mb-12">
        <Button variant="ghost" asChild className="group h-10 px-0 hover:bg-transparent text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-accent-secondary transition-colors">
          <Link href="/flash-sale">
            <ArrowLeft size={16} className="mr-3 group-hover:-translate-x-1 transition-transform" /> 
            Back
          </Link>
        </Button>
      </div>

      {/* 🖼️ Strategic Hero Section */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-12 mb-12 sm:mb-24">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <FlashSaleBanner flashSale={sale} />
        </motion.div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-12">
   

        {/* 📦 Artifact Manifest (Product Grid) */}
        <div className="space-y-12 sm:space-y-20">
 
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-10 lg:gap-12">
            {sale.products?.map((product, idx) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.05, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProductCard product={product} isFlashSale={true} />
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* End of Line Signifier */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className=" flex flex-col items-center text-center mt-10"
        >
    
           <Link href="/flash-sale">
              <Button variant="outline" className="rounded-full px-12 h-14 font-black uppercase tracking-[0.3em] text-[10px] border-border hover:bg-foreground hover:text-background transition-all">
                 More
              </Button>
           </Link>
        </motion.div>
      </div>
    </main>
  );
}
