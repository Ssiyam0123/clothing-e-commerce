"use client";

import { Input } from "@/components/ui/input";
import { Zap } from "lucide-react";

export default function FlashSaleDetailsForm({ register, watchStartImmediately, errors }) {
  return (
    <div className="admin-table-form p-8 md:p-10 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
          <Zap size={20} className="text-rose-500" />
        </div>
        <h3 className="text-sm font-black uppercase tracking-[0.2em]">Sale Details</h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block ml-1">Sale Name *</label>
          <Input 
            {...register("name", { required: true })}
            placeholder="e.g. Weekend Flash Sale"
            className="h-14 bg-muted/30 border-border/10 rounded-2xl px-6 text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-rose-500/20"
          />
          {errors.name && (
            <p className="text-[9px] font-bold text-rose-500 uppercase tracking-widest ml-1">Name is required</p>
          )}
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block ml-1">Description</label>
          <textarea 
            rows="3"
            {...register("description")}
            placeholder="Tell customers about this sale."
            className="w-full bg-muted/30 border border-border/10 rounded-2xl px-6 py-4 text-[11px] font-bold outline-none focus:ring-2 focus:ring-rose-500/20 transition-all resize-none text-foreground"
          />
        </div>

        <div className="p-6 bg-rose-600/5 rounded-3xl border border-rose-600/10 text-center space-y-3">
          <label className="text-[9px] font-black text-rose-500 uppercase tracking-[0.3em]">Discount Percentage (%)</label>
          <input 
            type="number"
            {...register("discount", { required: true, min: 1, max: 100 })}
            className="w-full bg-transparent text-5xl font-black text-center tracking-tighter text-rose-600 outline-none"
          />
          {errors.discount && (
            <p className="text-[9px] font-bold text-rose-500 uppercase tracking-widest">Valid discount (1-100) is required</p>
          )}
        </div>

        <div className="flex items-center gap-4 bg-muted/20 p-6 rounded-[2rem] border border-border/5">
          <input
            type="checkbox"
            {...register("startImmediately")}
            className="w-6 h-6 rounded-lg border-border/20 text-rose-600 focus:ring-0 cursor-pointer bg-muted/20"
          />
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-foreground">Start Immediately</p>
            <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Start the sale as soon as it is saved.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Start Date & Time</label>
            <input 
              type="datetime-local"
              {...register("startDate", { required: !watchStartImmediately })}
              disabled={watchStartImmediately}
              className="w-full h-12 bg-muted/30 border border-border/10 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest outline-none disabled:opacity-30 text-foreground"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">End Date & Time</label>
            <input 
              type="datetime-local"
              {...register("endDate", { required: true })}
              className="w-full h-12 bg-muted/30 border border-border/10 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest outline-none text-foreground"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 bg-muted/20 p-6 rounded-[2rem] border border-border/5">
          <input
            type="checkbox"
            {...register("isActive")}
            className="w-6 h-6 rounded-lg border-border/20 text-rose-600 focus:ring-0 cursor-pointer bg-muted/20"
          />
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-foreground">Active Status</p>
            <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Turn this sale on or off on your website.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
