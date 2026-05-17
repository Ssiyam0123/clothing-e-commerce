"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCoupons } from "@/modules/client/common/lib/useCoupons";
import Loader from "@/components/common/Loader";
import { Badge } from "@/components/ui/badge";
import { swalToast, swalError } from "@/utils/swal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Tag, 
  ChevronLeft, 
  Save,
  ShieldAlert,
  ArrowRight,
  Zap
} from "lucide-react";

export default function NewCouponPage() {
  const router = useRouter();
  const { createCoupon } = useCoupons();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      discountType: "fixed",
      isActive: true,
      minPurchase: 0,
      usageLimit: 100,
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await createCoupon(data);
      swalToast("Voucher Logic Initialized", "success");
      router.push("/admin/coupons");
    } catch (err) {
      swalError("Initialization Error", err.response?.data?.message || "Protocol conflict detected.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-page-container max-w-5xl">
      {/* 🔙 Navigation */}
      <div className="mb-4">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-all p-0 hover:bg-transparent"
        >
          <div className="w-8 h-8 rounded-full border border-border/10 flex items-center justify-center group-hover:border-foreground/20 transition-colors">
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          </div>
          <span>Return to Vault</span>
        </Button>
      </div>

      <div className="admin-section-header">
        <div className="flex items-center gap-6">
           <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20 shadow-2xl shadow-rose-500/10">
              <Zap size={24} className="fill-rose-500" />
           </div>
           <div className="space-y-1">
              <h1 className="admin-title">
                Initialize <span className="text-muted-foreground/30">Voucher</span>
              </h1>
              <p className="admin-subtitle">
                New Liquidation Protocol Protocol
              </p>
           </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-12"
      >
        <div className="admin-table-form p-8 md:p-14 space-y-12">
          <div className="flex items-center justify-between border-b border-border/5 pb-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground flex items-center gap-3">
              <ShieldAlert size={14} className="text-rose-500" /> Voucher_Logic_Configuration
            </h3>
            <Badge variant="outline" className="text-[8px] uppercase tracking-widest border-rose-500/20 text-rose-500 px-3 py-1">Secure Encryption</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">
                Voucher Identity (CODE) *
              </label>
              <Input
                {...register("code", { required: true })}
                placeholder="e.g. VANGUARD25"
                className="h-16 bg-muted/30 border-border/10 rounded-2xl px-6 font-black uppercase tracking-widest focus:ring-2 focus:ring-rose-500/20 transition-all"
              />
              {errors.code && <p className="text-[9px] font-bold text-rose-500 uppercase tracking-widest ml-1">Identity Required</p>}
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">
                Discount Strategy
              </label>
              <select
                {...register("discountType")}
                className="w-full h-16 bg-muted/30 border border-border/10 rounded-2xl px-6 font-black uppercase tracking-widest focus:ring-2 focus:ring-rose-500/20 outline-none cursor-pointer appearance-none transition-all"
              >
                <option value="fixed" className="bg-background">Fixed Reduction (৳ Amount)</option>
                <option value="percentage" className="bg-background">Percentage Yield (% Off)</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">
                Reduction Magnitude *
              </label>
              <Input
                type="number"
                {...register("discountValue", { required: true, min: 1 })}
                placeholder="0"
                className="h-16 bg-muted/30 border-border/10 rounded-2xl px-6 font-black focus:ring-2 focus:ring-rose-500/20 transition-all"
              />
              {errors.discountValue && <p className="text-[9px] font-bold text-rose-500 uppercase tracking-widest ml-1">Value must be &gt; 0</p>}
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">
                Activation Threshold (Min Purchase)
              </label>
              <Input
                type="number"
                {...register("minPurchase")}
                placeholder="0"
                className="h-16 bg-muted/30 border-border/10 rounded-2xl px-6 font-black focus:ring-2 focus:ring-rose-500/20 transition-all"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">
                Deployment Limit (Usage)
              </label>
              <Input
                type="number"
                {...register("usageLimit")}
                placeholder="∞"
                className="h-16 bg-muted/30 border-border/10 rounded-2xl px-6 font-black focus:ring-2 focus:ring-rose-500/20 transition-all"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">
                Expiry Protocol (Temporal End)
              </label>
              <input
                type="date"
                {...register("endDate")}
                className="w-full h-16 bg-muted/30 border border-border/10 rounded-2xl px-6 font-black uppercase tracking-widest focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 bg-rose-500/5 p-8 rounded-[2.5rem] border border-rose-500/10">
            <input
              type="checkbox"
              {...register("isActive")}
              className="w-8 h-8 rounded-xl bg-background border-border/20 text-rose-600 focus:ring-0 cursor-pointer transition-all"
            />
            <div className="space-y-1">
               <p className="text-[10px] font-black uppercase tracking-widest text-foreground">
                 Operative Status: Instant Deployment
               </p>
               <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Master override for voucher accessibility in checkout</p>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-24 bg-foreground text-background py-8 rounded-[2.5rem] font-black uppercase tracking-[0.5em] text-[12px] shadow-2xl hover:bg-rose-600 hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-4 group"
        >
          <Save size={20} className="group-hover:scale-110 transition-transform" />
          {isSubmitting ? "Synchronizing Logic..." : "Deploy Voucher Protocol"}
          <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
        </Button>
      </form>
    </div>
  );
}
