"use client";

import Link from "next/link";
import { useCoupons } from "@/hooks/useCoupons";
import DataTable from "@/components/admin/DataTable";
import TableSkeleton from "@/components/common/TableSkeleton";
import { swalConfirm, swalToast, swalError } from "@/utils/swal";

export default function CouponArchive() {
  const { coupons, isLoading, deleteCoupon } = useCoupons();

  const handleDelete = async (id) => {
    const confirmed = await swalConfirm(
      "Deactivate Protocol?",
      "This coupon will be purged from the settlement engine.",
    );
    if (confirmed) {
      try {
        await deleteCoupon(id);
        swalToast("Voucher Purged", "success");
      } catch (err) {
        swalError("Action Failed", "Voucher is linked to existing orders.");
      }
    }
  };

  const columns = [
    {
      label: "Voucher Code",
      render: (item) => (
        <span className="font-black text-indigo-500 bg-indigo-500/5 px-4 py-2 rounded-xl border border-indigo-500/10 uppercase tracking-widest text-xs">
          {item.code}
        </span>
      ),
    },
    {
      label: "Discount",
      render: (item) => (
        <span className="font-black text-zinc-900 dark:text-white">
          {item.discountType === "percentage"
            ? `${item.discountValue}% OFF`
            : `৳${item.discountValue} FLAT`}
        </span>
      ),
    },
    {
      label: "Usage",
      render: (item) => (
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-black uppercase text-zinc-400">
            Limit: {item.usageLimit || "∞"}
          </p>
          <div className="w-24 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500"
              style={{
                width: `${Math.min((item.usedCount / (item.usageLimit || 100)) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      ),
    },
    {
      label: "Timeline Status",
      render: (item) => {
        const now = new Date();
        const start = new Date(item.startDate);
        const end = item.endDate ? new Date(item.endDate) : null;

        let status = {
          label: "Active",
          style: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        };
        if (!item.isActive)
          status = {
            label: "Disabled",
            style: "bg-zinc-100 text-zinc-400 border-zinc-200",
          };
        else if (now < start)
          status = {
            label: "Pending",
            style: "bg-amber-500/10 text-amber-500 border-amber-500/20",
          };
        else if (end && now > end)
          status = {
            label: "Expired",
            style: "bg-rose-500/10 text-rose-500 border-rose-500/20",
          };

        return (
          <span
            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${status.style}`}
          >
            {status.label}
          </span>
        );
      },
    },
    {
      label: "Actions",
      render: (item) => (
        <div className="flex items-center gap-2 justify-end">
          <Link
            href={`/admin/coupons/${item._id}`}
            className="p-2.5 bg-zinc-100 dark:bg-zinc-900 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              ></path>
            </svg>
          </Link>
          <button
            onClick={() => handleDelete(item._id)}
            className="p-2.5 bg-zinc-100 dark:bg-zinc-900 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase mb-2">
            Voucher Hub
          </h1>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">
            Settlement Logic Management
          </p>
        </div>
        <Link
          href="/admin/coupons/new"
          className="bg-zinc-900 dark:bg-white text-white dark:text-black px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
        >
          + Initialize Voucher
        </Link>
      </div>

      {isLoading ? (
        <TableSkeleton rowCount={6} />
      ) : (
        <DataTable columns={columns} data={coupons} />
      )}
    </div>
  );
}
