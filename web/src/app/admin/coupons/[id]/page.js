"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useCoupons } from "@/hooks/useCoupons";
import Loader from "@/components/common/Loader";
import Link from "next/link";
import { swalToast, swalError } from "@/utils/swal";

export default function CouponForm() {
  const { id } = useParams();
  const router = useRouter();
  const isEdit = id !== "new";
  const { coupons, createCoupon, updateCoupon } = useCoupons();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      discountType: "percentage",
      isActive: true,
      minOrderAmount: 0,
      usageLimit: 1,
    },
  });

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (isEdit && coupons) {
      const coupon = coupons.find((c) => c._id === id);
      if (coupon) {
        Object.keys(coupon).forEach((key) => {
          if (key.includes("Date")) setValue(key, formatDateTime(coupon[key]));
          else setValue(key, coupon[key]);
        });
      }
    }
  }, [isEdit, id, coupons, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (isEdit) {
        await updateCoupon({ id, data });
        swalToast("Logic Updated", "success");
      } else {
        await createCoupon(data);
        swalToast("Voucher Initialized", "success");
      }
      router.push("/admin/coupons");
    } catch (err) {
      swalError(
        "Protocol Error",
        err.response?.data?.message || "Check validation parameters.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEdit && !coupons)
    return (
      <div className="p-20">
        <Loader />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white dark:bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800">
        <h1 className="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
          {isEdit ? "Refine Voucher" : "New Voucher"}
        </h1>
        <Link
          href="/admin/coupons"
          className="text-[10px] font-black uppercase text-zinc-400 hover:text-white transition-colors"
        >
          ← Hub
        </Link>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-[#0a0a0a] rounded-[3rem] border border-zinc-200 dark:border-zinc-800 p-10 md:p-14 shadow-sm space-y-10"
      >
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
              Voucher Code *
            </label>
            <input
              {...register("code", { required: true })}
              placeholder="E.G. VANGUARD20"
              className="w-full bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 font-black uppercase focus:border-zinc-900 dark:focus:border-white outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
              Discount Type
            </label>
            <select
              {...register("discountType")}
              className="w-full bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 font-bold focus:border-zinc-900 dark:focus:border-white outline-none cursor-pointer"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (৳)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
              Value *
            </label>
            <input
              type="number"
              {...register("discountValue", { required: true })}
              className="w-full bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 font-black focus:border-zinc-900 dark:focus:border-white outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
              Usage Limit
            </label>
            <input
              type="number"
              {...register("usageLimit")}
              className="w-full bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 font-black focus:border-zinc-900 dark:focus:border-white outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
              Min Order Amount
            </label>
            <input
              type="number"
              {...register("minOrderAmount")}
              className="w-full bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 font-black focus:border-zinc-900 dark:focus:border-white outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
              End Date (Optional)
            </label>
            <input
              type="datetime-local"
              {...register("endDate")}
              className="w-full bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 font-bold focus:border-zinc-900 dark:focus:border-white outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 bg-zinc-50 dark:bg-[#111] p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800">
          <input
            type="checkbox"
            {...register("isActive")}
            className="w-6 h-6 rounded-lg bg-white border-zinc-300 text-zinc-900 focus:ring-0 cursor-pointer"
          />
          <p className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-white">
            Allow usage in checkout
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black py-6 rounded-full font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
        >
          {isSubmitting
            ? "Syncing..."
            : isEdit
              ? "Update Protocol"
              : "Deploy Voucher"}
        </button>
      </form>
    </div>
  );
}
