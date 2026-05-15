"use client";

import { useParams, useRouter } from "next/navigation";
import { useUsers } from "@/hooks/useUsers";
import { useAdminOrders } from "@/hooks/admin/useAdminOrders";
import { useMemo } from "react";
import Loader from "@/components/common/Loader";
import Link from "next/link";
import { 
  ShoppingBag, 
  ArrowLeft, 
  ShieldCheck, 
  Activity,
  DollarSign,
  Package,
  Calendar,
  Clock,
  ChevronRight,
  TrendingUp,
  Edit3
} from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageUrl } from "@/utils/imageUtils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useFilters } from "@/hooks/useFilters";
import Pagination from "@/components/common/Pagination";

export default function UserAuditPage() {
  const { id } = useParams();
  const { 
    page, 
    setPage, 
    queryParams 
  } = useFilters({
    initialLimit: 30
  });

  const { useUser } = useUsers();
  const { data: userData, isLoading: isUserLoading } = useUser(id);
  
  const { orders, total, pages, isLoading: allOrdersLoading } = useAdminOrders({ 
    ...queryParams,
    user: id 
  });

  const stats = useMemo(() => {
    if (!orders) return { totalSpent: 0, totalOrders: 0 };
    const successfulOrders = orders.filter(o => o.paymentResult?.status === "Completed" || o.orderStatus === "Delivered");
    return {
      totalSpent: successfulOrders.reduce((acc, curr) => acc + curr.totalPrice, 0),
      totalOrders: total || 0
    };
  }, [orders, total]);

  if (isUserLoading || allOrdersLoading)
    return (
      <div className="p-20">
        <Loader />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto pb-24 px-4 sm:px-6 space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* 🏔️ Tactical Identity Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-card/50 backdrop-blur-3xl p-8 sm:p-10 rounded-[3rem] border border-border/10 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full -mr-20 -mt-20 group-hover:bg-blue-600/10 transition-colors duration-1000" />
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="relative">
             <Avatar className="h-24 w-24 rounded-3xl border-2 border-border/10 shadow-2xl">
                <AvatarImage src={getImageUrl(userData?.avatar)} className="object-cover" />
                <AvatarFallback className="bg-accent text-2xl font-black">{userData?.name?.[0]}</AvatarFallback>
             </Avatar>
             <div className="absolute -bottom-2 -right-2 bg-foreground text-background p-2 rounded-xl shadow-xl border border-border/10">
                <ShieldCheck size={16} />
             </div>
          </div>
          
          <div className="space-y-1">
            <h1 className="text-3xl font-black uppercase tracking-tighter italic">
               {userData?.name}
            </h1>
            <div className="flex items-center gap-3">
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">
                 {userData?.email}
               </p>
               <Badge className={cn(
                 "text-[8px] font-black uppercase tracking-widest border-none px-3 py-0.5 rounded-full",
                 userData?.role?.name === "admin" ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"
               )}>
                 {userData?.role?.name === "admin" ? "★ Vanguard Admin" : "Vanguard Member"}
               </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 relative z-10">
          <Link
            href={`/admin/users/${id}/edit`}
            className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-foreground text-background text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
          >
            <Edit3 size={14} />
            Modify Profile
          </Link>
          <Link
            href="/admin/users"
            className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-accent/10 border border-border/5 text-[10px] font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Abort
          </Link>
        </div>
      </div>

      {/* 📊 Strategic Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card/50 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-border/10 shadow-xl space-y-4">
           <div className="flex justify-between items-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                 <DollarSign size={24} />
              </div>
              <Badge variant="outline" className="text-[8px] uppercase tracking-widest border-emerald-500/20 text-emerald-500">Lifetime Value</Badge>
           </div>
           <div className="space-y-1">
              <p className="text-4xl font-black tracking-tighter italic">৳{stats.totalSpent.toLocaleString()}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Capital Deployed</p>
           </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card/50 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-border/10 shadow-xl space-y-4">
           <div className="flex justify-between items-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                 <Package size={24} />
              </div>
              <Badge variant="outline" className="text-[8px] uppercase tracking-widest border-blue-500/20 text-blue-500">Protocols</Badge>
           </div>
           <div className="space-y-1">
              <p className="text-4xl font-black tracking-tighter italic">{stats.totalOrders}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Execution Volume</p>
           </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card/50 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-border/10 shadow-xl space-y-4">
           <div className="flex justify-between items-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                 <Calendar size={24} />
              </div>
              <Badge variant="outline" className="text-[8px] uppercase tracking-widest border-amber-500/20 text-amber-500">Chronology</Badge>
           </div>
           <div className="space-y-1">
              <p className="text-2xl font-black tracking-tighter uppercase italic truncate">
                {new Date(userData?.createdAt).toLocaleDateString("en-US", { month: 'long', year: 'numeric' })}
              </p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Member Inception</p>
           </div>
        </motion.div>
      </div>

      {/* 🕵️ Transactional Ledger Sector */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
           <div className="space-y-1">
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground flex items-center gap-3">
                <Activity size={14} className="text-blue-500" /> Operational_Ledger
              </h2>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest italic opacity-60">Tracing chronological transaction commits for {userData?.name}</p>
           </div>
        </div>

        <Card className="rounded-[3.5rem] border-border/10 bg-card/30 backdrop-blur-xl shadow-2xl overflow-hidden min-h-[600px]">
           <div className="overflow-x-auto">
              {!orders || orders.length === 0 ? (
                <div className="h-[500px] flex flex-col items-center justify-center space-y-4 text-muted-foreground opacity-30">
                   <div className="w-16 h-16 rounded-full border-2 border-dashed border-current flex items-center justify-center">
                      <ShoppingBag size={24} />
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-[0.4em]">Zero Transactions Detected</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-accent/5">
                      <th className="p-8 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">Protocol</th>
                      <th className="p-8 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">Status</th>
                      <th className="p-8 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground text-right">Commit Value</th>
                      <th className="p-8 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/5">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-accent/5 transition-colors group">
                        <td className="p-8">
                          <div className="flex flex-col gap-1">
                             <span className="text-xs font-black uppercase tracking-tighter italic">#{order._id.slice(-8).toUpperCase()}</span>
                             <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="p-8">
                          <Badge variant="outline" className={cn(
                            "px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border-none shadow-sm",
                            order.orderStatus === "Delivered" ? "bg-emerald-500/10 text-emerald-500" :
                            order.orderStatus === "Processing" ? "bg-blue-500/10 text-blue-500" :
                            order.orderStatus === "Cancelled" ? "bg-rose-500/10 text-rose-500" :
                            "bg-amber-500/10 text-amber-500"
                          )}>
                            ● {order.orderStatus}
                          </Badge>
                        </td>
                        <td className="p-8 text-right">
                          <p className="text-sm font-black text-foreground italic">৳{order.totalPrice.toLocaleString()}</p>
                          <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{order.paymentMethod}</p>
                        </td>
                        <td className="p-8 text-right">
                          <Link 
                            href={`/admin/orders/${order._id}`}
                            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-accent/10 border border-border/5 text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all group/btn shadow-inner"
                          >
                            Verify
                            <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
           </div>

           {orders?.length > 0 && (
             <div className="p-8 border-t border-border/5 bg-accent/5">
                <Pagination 
                  page={page} 
                  totalPages={pages} 
                  onPageChange={setPage} 
                  className="py-0 sm:py-0 justify-between flex-row-reverse"
                />
             </div>
           )}
        </Card>
      </div>
    </div>
  );
}
