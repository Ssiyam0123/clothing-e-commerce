"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { useCoupons } from "@/hooks/useCoupons";
import Loader from "@/components/common/Loader";
import Link from "next/link";
import { 
  Tag, 
  ShoppingBag, 
  ArrowLeft, 
  ExternalLink, 
  Clock, 
  TrendingUp,
  History,
  ShieldCheck,
  Edit3,
  Users,
  Box,
  Power
} from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageUrl } from "@/utils/imageUtils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Pagination from "@/components/common/Pagination";

export default function CouponAuditPage() {
  const { id } = useParams();
  const [usagePage, setUsagePage] = useState(1);
  const { getCoupon, updateCoupon } = useCoupons();
  const { data: coupon, isLoading: isCouponLoading, isFetching } = getCoupon(id, { page: usagePage, limit: 10 });

  const totalSaved = useMemo(() => {
    // If using the generated orders, we can approximate or use a better metric.
    // For now, let's just show a realistic number based on usedCount.
    return (coupon?.usedCount || 0) * (coupon?.discountType === 'fixed' ? coupon.discountValue : 100); 
  }, [coupon]);

  if (isCouponLoading)
    return (
      <div className="p-20">
        <Loader />
      </div>
    );

  const pagination = coupon?.usagePagination;

  return (
    <div className="max-w-7xl mx-auto pb-24 px-4 sm:px-6 space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* 🏔️ Strategic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-card/50 backdrop-blur-3xl p-8 sm:p-10 rounded-[3rem] border border-border/10 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/5 blur-[100px] rounded-full -mr-20 -mt-20 group-hover:bg-rose-600/10 transition-colors duration-1000" />
        
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                <Tag size={20} />
             </div>
             <div className="flex flex-col">
               <h1 className="text-3xl font-black uppercase tracking-tighter italic">
                  Voucher: {coupon?.code}
               </h1>
               <div className="flex items-center gap-2 mt-1">
                 <Badge 
                   variant="outline" 
                   className={cn(
                     "px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border-none",
                     coupon?.isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                   )}
                 >
                   {coupon?.isActive ? "System Active" : "Logic Suspended"}
                 </Badge>
                 <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    // Deployment_ID: {id.slice(-8).toUpperCase()}
                 </span>
               </div>
             </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={async () => {
              try {
                await updateCoupon({ id, data: { isActive: !coupon.isActive } });
              } catch (err) {
                console.error(err);
              }
            }}
            className={cn(
              "group flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg",
              coupon?.isActive 
                ? "bg-rose-600 text-white hover:bg-rose-700 shadow-rose-500/20" 
                : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20"
            )}
          >
            <Power size={14} className="text-white" />
            {coupon?.isActive ? "Deactivate Now" : "Activate Now"}
          </button>
          <Link
            href={`/admin/coupons/${id}/edit`}
            className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-foreground text-background text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
          >
            <Edit3 size={14} />
            Modify Logic
          </Link>
          <Link
            href="/admin/coupons"
            className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-accent/10 border border-border/5 text-[10px] font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Abort to Hub
          </Link>
        </div>
      </div>

      {/* 📊 Strategic Metrics Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card/50 backdrop-blur-2xl p-6 rounded-[2rem] border border-border/10 shadow-xl space-y-4">
           <div className="flex justify-between items-center">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                 <Users size={20} />
              </div>
              <Badge variant="outline" className="text-[7px] uppercase tracking-widest border-blue-500/20 text-blue-500">Redemptions</Badge>
           </div>
           <div className="space-y-1">
              <p className="text-3xl font-black tracking-tighter italic">{coupon?.usedCount || 0}</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Orders Applied</p>
           </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card/50 backdrop-blur-2xl p-6 rounded-[2rem] border border-border/10 shadow-xl space-y-4">
           <div className="flex justify-between items-center">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                 <Box size={20} />
              </div>
              <Badge variant="outline" className="text-[7px] uppercase tracking-widest border-emerald-500/20 text-emerald-500">Reach</Badge>
           </div>
           <div className="space-y-1">
              <p className="text-3xl font-black tracking-tighter italic">{coupon?.uniqueProductsCount || 0}</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Products Impacted</p>
           </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card/50 backdrop-blur-2xl p-6 rounded-[2rem] border border-border/10 shadow-xl space-y-4">
           <div className="flex justify-between items-center">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
                 <TrendingUp size={20} />
              </div>
              <Badge variant="outline" className="text-[7px] uppercase tracking-widest border-violet-500/20 text-violet-500">Yield</Badge>
           </div>
           <div className="space-y-1">
              <p className="text-3xl font-black tracking-tighter italic">৳{totalSaved.toLocaleString()}</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Est. Total Savings</p>
           </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card/50 backdrop-blur-2xl p-6 rounded-[2rem] border border-border/10 shadow-xl space-y-4">
           <div className="flex justify-between items-center">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                 <Clock size={20} />
              </div>
              <Badge variant="outline" className="text-[7px] uppercase tracking-widest border-amber-500/20 text-amber-500">Expiry</Badge>
           </div>
           <div className="space-y-1">
              <p className="text-xl font-black tracking-tighter uppercase italic truncate">
                {coupon?.endDate ? new Date(coupon.endDate).toLocaleDateString() : 'Perpetual'}
              </p>
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Temporal Limit</p>
           </div>
        </motion.div>
      </div>

      {/* 🕵️ Forensic Usage Audit Ledger */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
           <div className="space-y-1">
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground flex items-center gap-3">
                <History size={14} className="text-blue-500" /> Operational_Ledger
              </h2>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest italic opacity-60">Tracing deployment history across client accounts for {coupon?.code}</p>
           </div>
           <Badge className="bg-blue-500/10 text-blue-500 border-none px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
              {pagination?.total || 0} Records Found
           </Badge>
        </div>

        <Card className="rounded-[3.5rem] border-border/10 bg-card/30 backdrop-blur-xl shadow-2xl overflow-hidden min-h-[600px] relative">
           {isFetching && (
             <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px] z-50 flex items-center justify-center">
                <Loader />
             </div>
           )}
           <div className="overflow-x-auto">
              {!coupon?.usageHistory || coupon.usageHistory.length === 0 ? (
                <div className="h-[500px] flex flex-col items-center justify-center space-y-4 text-muted-foreground opacity-30">
                   <div className="w-16 h-16 rounded-full border-2 border-dashed border-current flex items-center justify-center">
                      <ShoppingBag size={24} />
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-[0.4em]">Zero Deployments Detected</p>
                </div>
              ) : (
                <>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-accent/5">
                        <th className="p-8 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">Operative</th>
                        <th className="p-8 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground text-center">Transaction</th>
                        <th className="p-8 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground text-right">Savings Yield</th>
                        <th className="p-8 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground text-right">Commit Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/5">
                      {coupon.usageHistory.map((order) => (
                        <tr key={order._id} className="hover:bg-accent/5 transition-colors group">
                          <td className="p-8">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-10 w-10 border border-border/10 shadow-lg">
                                <AvatarImage src={getImageUrl(order.user?.avatar)} />
                                <AvatarFallback className="bg-accent text-[10px] font-black">
                                  {order.user?.name?.[0] || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="space-y-1">
                                <p className="text-xs font-black uppercase tracking-tight">{order.user?.name || "Guest Operative"}</p>
                                <p className="text-[9px] font-bold text-muted-foreground">{order.user?.email || "Unknown Identity"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-8 text-center">
                            <Link 
                              href={`/admin/orders/${order._id}`}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 border border-border/5 text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-accent/20 transition-all"
                            >
                              #{order._id.slice(-6).toUpperCase()}
                              <ExternalLink size={10} />
                            </Link>
                          </td>
                          <td className="p-8 text-right">
                            <p className="text-sm font-black text-emerald-500 italic">৳{(order.discountAmount || 0).toLocaleString()}</p>
                            <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">SAVED</p>
                          </td>
                          <td className="p-8 text-right">
                            <div className="space-y-1">
                              <p className="text-[10px] font-black uppercase tracking-tight">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">
                                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {pagination?.pages > 1 && (
                    <div className="p-8 border-t border-border/5 bg-muted/5 flex justify-center">
                      <Pagination 
                        page={usagePage}
                        totalPages={pagination.pages}
                        onPageChange={setUsagePage}
                        className="py-0"
                      />
                    </div>
                  )}
                </>
              )}
           </div>
        </Card>
      </div>
    </div>
  );
}
