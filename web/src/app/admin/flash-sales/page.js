"use client";

import { useState } from "react";
import { useFlashSales } from "@/hooks/useFlashSale";
import Link from "next/link";
import { swalConfirm, swalToast, swalError } from "@/utils/swal";
import CountdownTimer from "@/components/store/CountdownTimer";

const PremiumStatusBadge = ({ status }) => {
  const styles = {
    active:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    pending:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    inactive:
      "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  };
  const text = {
    active: "● LIVE NOW",
    pending: "◐ PENDING",
    inactive: "○ ENDED",
  };
  return (
    <span
      className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${styles[status]}`}
    >
      {text[status]}
    </span>
  );
};

export default function AdminFlashSales() {
  const { allFlashSales, allLoading, updateFlashSale, deleteFlashSale } =
    useFlashSales(true);

  const handleToggleActive = async (saleId, currentActive) => {
    try {
      await updateFlashSale({ id: saleId, data: { isActive: !currentActive } });
      swalToast(
        `Campaign ${!currentActive ? "Activated" : "Deactivated"}`,
        "success",
      );
    } catch (err) {
      swalError("Status Update Failed", "Could not sync with the server.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await swalConfirm(
      "Delete Campaign?",
      "This promotion will be permanently removed from all linked products.",
    );
    if (confirmed) {
      try {
        await deleteFlashSale(id);
        swalToast("Campaign Purged", "success");
      } catch (err) {
        swalError("Action Blocked", "Could not delete the campaign.");
      }
    }
  };

  return (
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase mb-2">
            Campaigns
          </h1>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">
            Flash Sale & Promotions
          </p>
        </div>
        <Link
          href="/admin/flash-sales/new"
          className="bg-zinc-900 dark:bg-white text-white dark:text-black px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
        >
          + Initialize Campaign
        </Link>
      </div>

      {/* Grid Area */}
      {allLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8 h-[400px] animate-pulse"
            ></div>
          ))}
        </div>
      ) : allFlashSales?.length === 0 ? (
        <div className="col-span-full text-center py-24 bg-white dark:bg-[#0a0a0a] rounded-[3rem] border border-dashed border-zinc-200 dark:border-zinc-800 shadow-inner">
          <span className="text-7xl block mb-6 grayscale opacity-20">🏷️</span>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter mb-2">
            No Active Campaigns
          </h2>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">
            Launch a new protocol to start selling
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {allFlashSales?.map((sale) => {
            const now = new Date();
            const start = new Date(sale.startDate);
            const end = new Date(sale.endDate);
            let status;
            if (!sale.isActive) status = "inactive";
            else if (now > end) status = "inactive";
            else if (now < start) status = "pending";
            else status = "active";

            return (
              <div
                key={sale._id}
                className="bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm hover:-translate-y-1 transition-all duration-500 flex flex-col p-8 group"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 px-4 py-2 rounded-2xl flex flex-col items-center">
                    <span className="text-3xl font-black leading-none">
                      {sale.discount}%
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-widest mt-1">
                      Off
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <PremiumStatusBadge status={status} />
                    <button
                      onClick={() =>
                        handleToggleActive(sale._id, sale.isActive)
                      }
                      className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${
                        sale.isActive
                          ? "bg-zinc-900 dark:bg-white text-white dark:text-black border-transparent"
                          : "bg-transparent text-zinc-500 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"
                      }`}
                    >
                      {sale.isActive ? "Turn Off" : "Turn On"}
                    </button>
                  </div>
                </div>

                <h3 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter line-clamp-1 mb-6">
                  {sale.name}
                </h3>

                {/* Countdown for pending sales */}
                {status === "pending" && (
                  <div className="mb-6 flex justify-center">
                    <CountdownTimer targetDate={start} label="Starts In" />
                  </div>
                )}

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-50 dark:bg-[#111] border border-zinc-100 dark:border-zinc-800/50">
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                      Starts
                    </span>
                    <span className="text-xs font-bold text-zinc-900 dark:text-white uppercase">
                      {start.toLocaleString([], {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-50 dark:bg-[#111] border border-zinc-100 dark:border-zinc-800/50">
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                      Ends
                    </span>
                    <span className="text-xs font-bold text-zinc-900 dark:text-white uppercase">
                      {end.toLocaleString([], {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-50 dark:bg-[#111] border border-zinc-100 dark:border-zinc-800/50">
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                      Inventory
                    </span>
                    <span className="text-xs font-black text-zinc-900 dark:text-white">
                      {sale.products?.length || 0} Items
                    </span>
                  </div>
                </div>

                <div className="mt-auto flex gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                  <Link
                    href={`/admin/flash-sales/${sale._id}`}
                    className="flex-1 text-center bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all border border-zinc-200 dark:border-zinc-800"
                  >
                    Edit Config
                  </Link>
                  <button
                    onClick={() => handleDelete(sale._id)}
                    className="bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 p-3.5 rounded-2xl hover:bg-rose-600 hover:text-white transition-all border border-rose-100 dark:border-rose-500/20"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
