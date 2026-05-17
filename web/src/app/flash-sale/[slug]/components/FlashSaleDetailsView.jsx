"use client";

import { useAppStore } from "@/store/appStore";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import FlashSaleHero from "./FlashSaleHero";
import FlashSaleProductGrid from "./FlashSaleProductGrid";

export default function FlashSaleDetailsView({ sale }) {
  const { isMounted } = useAppStore();

  if (!isMounted) return null;

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation Header */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-12 mb-8 sm:mb-12">
        <Button variant="ghost" asChild className="group h-10 px-0 hover:bg-transparent text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-accent-secondary transition-colors">
          <Link href="/flash-sale">
            <ArrowLeft size={16} className="mr-3 group-hover:-translate-x-1 transition-transform" /> 
            Back
          </Link>
        </Button>
      </div>

      <FlashSaleHero sale={sale} />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-12">
        <FlashSaleProductGrid products={sale.products} />
        
        {/* End of Line Signifier */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="flex flex-col items-center text-center mt-10"
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
