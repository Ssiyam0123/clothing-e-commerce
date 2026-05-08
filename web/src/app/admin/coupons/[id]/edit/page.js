"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useCoupons } from "@/hooks/useCoupons";
import Loader from "@/components/common/Loader";
import Link from "next/link";
import { 
  Tag, 
  ArrowLeft, 
  ShieldCheck, 
  Save,
  ShieldAlert,
  History,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { swalToast, swalError } from "@/utils/swal";

export default function CouponEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getCoupon, updateCoupon } = useCoupons();
  const { data: coupon, isLoading: isCouponLoading } = getCoupon(id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (coupon) {
      setValue("code", coupon.code);
      setValue("discountType", coupon.discountType);
      setValue("discountValue", coupon.discountValue);
      setValue("minPurchase", coupon.minPurchase);
      setValue("usageLimit", coupon.usageLimit);
      setValue("endDate", coupon.endDate ? new Date(coupon.endDate).toISOString().split('T')[0] : "");
      setValue("isActive", coupon.isActive);
    }
  }, [coupon, setValue]);

  const onUpdateLogic = async (data) => {
    setIsSubmitting(true);
    try {
      await updateCoupon.mutateAsync({ id, data });
      swalToast("Voucher Logic Synchronized", "success");
      router.push("/admin/coupons");
    } catch (err) {
      swalError("Logic Conflict", err.response?.data?.message || "Failed to commit protocol changes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCouponLoading)
    return (
      <div className="p-20">
        <Loader />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto pb-24 px-4 sm:px-6 space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* 🏔️ Tactical Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-card/50 backdrop-blur-3xl p-8 sm:p-10 rounded-[3rem] border border-border/10 shadow-2xl">
        <div className="flex items-center gap-6">
           <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
              <Tag size={24} />
           </div>
           <div className="space-y-1">
              <h1 className="text-2xl font-black uppercase tracking-tighter italic">
                Refine Voucher Logic
              </h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                Protocol: {coupon?.code} // ID: {id.slice(-8).toUpperCase()}
              </p>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/coupons/${id}`}
            className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-accent/10 border border-border/5 text-[10px] font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all"
          >
            <History size={14} />
            View Audit
          </Link>
          <Link
            href="/admin/coupons"
            className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-accent/10 border border-border/5 text-[10px] font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Abort
          </Link>
        </div>
      </div>

      {/* 📑 Voucher Configuration Sector */}
      <form
        onSubmit={handleSubmit(onUpdateLogic)}
        className="bg-card/30 backdrop-blur-xl rounded-[3.5rem] border border-border/10 p-8 sm:p-14 shadow-2xl space-y-12"
      >
        <div className="space-y-10">
           <div className="flex items-center justify-between border-b border-border/5 pb-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground flex items-center gap-3">
                <ShieldAlert size={14} className="text-rose-500" /> Voucher_Logic_Module
              </h3>
              <Badge variant="outline" className="text-[8px] uppercase tracking-widest border-border/20 px-3 py-1">Active Encryption</Badge>
           </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">
                Voucher Code *
              </label>
              <input
                {...register("code", { required: true })}
                className="w-full bg-accent/5 border border-border/10 rounded-2xl p-5 font-black uppercase tracking-widest focus:border-rose-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">
                Discount Strategy
              </label>
              <select
                {...register("discountType")}
                className="w-full bg-accent/5 border border-border/10 rounded-2xl p-5 font-bold focus:border-rose-500 outline-none cursor-pointer appearance-none"
              >
                <option value="fixed">Fixed Reduction (৳ Amount)</option>
                <option value="percentage">Percentage Yield (% Off)</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">
                Reduction Magnitude *
              </label>
              <input
                type="number"
                {...register("discountValue", { required: true })}
                className="w-full bg-accent/5 border border-border/10 rounded-2xl p-5 font-black focus:border-rose-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">
                Activation Threshold (Min Purchase)
              </label>
              <input
                type="number"
                {...register("minPurchase")}
                className="w-full bg-accent/5 border border-border/10 rounded-2xl p-5 font-black focus:border-rose-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">
                Deployment Limit (Usage)
              </label>
              <input
                type="number"
                {...register("usageLimit")}
                className="w-full bg-accent/5 border border-border/10 rounded-2xl p-5 font-black focus:border-rose-500 outline-none transition-all"
                placeholder="∞"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">
                Expiry Protocol (Temporal End)
              </label>
              <input
                type="date"
                {...register("endDate")}
                className="w-full bg-accent/5 border border-border/10 rounded-2xl p-5 font-bold focus:border-rose-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 bg-accent/5 p-8 rounded-[2.5rem] border border-border/5">
            <input
              type="checkbox"
              {...register("isActive")}
              className="w-8 h-8 rounded-xl bg-background border-border/20 text-rose-600 focus:ring-0 cursor-pointer"
            />
            <div className="space-y-1">
               <p className="text-[10px] font-black uppercase tracking-widest text-foreground">
                 Operative Status: Active Deployment
               </p>
               <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Master override for voucher accessibility in checkout</p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-foreground text-background py-8 rounded-[2rem] font-black uppercase tracking-[0.5em] text-[11px] shadow-2xl hover:bg-rose-600 hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-4 group"
        >
          <Save size={18} className="group-hover:scale-110 transition-transform" />
          {isSubmitting ? "Synchronizing..." : "Commit Protocol Changes"}
        </button>
      </form>
    </div>
  );
}
