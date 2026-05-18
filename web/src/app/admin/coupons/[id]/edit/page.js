"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAdminCoupons } from "@/app/admin/coupons/lib/useAdminCoupons";
import Loader from "@/components/common/Loader";
import { Badge } from "@/components/ui/badge";
import { swalToast, swalError } from "@/utils/swal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Save,
  ShieldAlert,
  ArrowRight,
  History
} from "lucide-react";
import AdminPageHeader, { AdminBackLink } from "@/app/admin/_components/AdminPageHeader";

export default function CouponEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getCoupon, updateCoupon } = useAdminCoupons();
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
      await updateCoupon({ id, data });
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
      <div className="admin-page-container">
        <Loader />
      </div>
    );

  return (
    <div className="admin-page-container max-w-5xl">
      <AdminBackLink href="/admin/coupons" label="Back to coupons" />

      <AdminPageHeader
        title="Edit coupon"
        description={coupon?.code ? `Code: ${coupon.code}` : "Update discount rules and limits."}
        actions={
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/coupons/${id}`)}
            className="h-11 rounded-xl text-sm font-medium"
          >
            <History size={16} className="mr-2" />
            View history
          </Button>
        }
      />

      <form
        onSubmit={handleSubmit(onUpdateLogic)}
        className="space-y-12"
      >
        <div className="admin-table-form p-8 md:p-14 space-y-12">
          <div className="flex items-center justify-between border-b border-border/5 pb-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground flex items-center gap-3">
              <ShieldAlert size={14} className="text-rose-500" /> Voucher_Logic_Module
            </h3>
            <Badge variant="outline" className="text-[8px] uppercase tracking-widest border-rose-500/20 text-rose-500 px-3 py-1">Active Encryption</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">
                Voucher Identity *
              </label>
              <Input
                {...register("code", { required: true })}
                className="h-16 bg-muted/30 border-border/10 rounded-2xl px-6 font-black uppercase tracking-widest focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">
                Discount Strategy
              </label>
              <select
                {...register("discountType")}
                className="w-full h-16 bg-muted/30 border border-border/10 rounded-2xl px-6 font-black uppercase tracking-widest focus:ring-2 focus:ring-rose-500/20 outline-none cursor-pointer appearance-none"
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
                {...register("discountValue", { required: true })}
                className="h-16 bg-muted/30 border-border/10 rounded-2xl px-6 font-black focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">
                Activation Threshold (Min Purchase)
              </label>
              <Input
                type="number"
                {...register("minPurchase")}
                className="h-16 bg-muted/30 border-border/10 rounded-2xl px-6 font-black focus:ring-2 focus:ring-rose-500/20"
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
                className="h-16 bg-muted/30 border-border/10 rounded-2xl px-6 font-black focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">
                Expiry Protocol (Temporal End)
              </label>
              <input
                type="date"
                {...register("endDate")}
                className="w-full h-16 bg-muted/30 border border-border/10 rounded-2xl px-6 font-black uppercase tracking-widest focus:ring-2 focus:ring-rose-500/20 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 bg-rose-500/5 p-8 rounded-[2.5rem] border border-rose-500/10">
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

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-24 bg-foreground text-background py-8 rounded-[2.5rem] font-black uppercase tracking-[0.5em] text-[12px] shadow-2xl hover:bg-rose-600 hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-4 group"
        >
          <Save size={20} className="group-hover:scale-110 transition-transform" />
          {isSubmitting ? "Synchronizing Logic..." : "Commit Protocol Changes"}
          <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
        </Button>
      </form>
    </div>
  );
}



