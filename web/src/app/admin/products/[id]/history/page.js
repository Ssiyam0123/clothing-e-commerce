"use client";

import { use } from "react";
import { useProductHistory } from "@/hooks/admin/useProductHistory";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  History, 
  ShoppingCart, 
  User as UserIcon, 
  Calendar, 
  CreditCard,
  TrendingUp,
  PackageCheck
} from "lucide-react";
import Link from "next/link";
import { getImageUrl } from "@/utils/imageUtils";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { cn } from "@/lib/utils";

export default function ProductHistoryPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { id } = params;
  const { data, isLoading } = useProductHistory(id);

  if (isLoading) {
    return (
      <div className="admin-page-container space-y-10">
        <Skeleton className="h-20 w-64 rounded-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 rounded-[2rem]" />
          <Skeleton className="h-32 rounded-[2rem]" />
          <Skeleton className="h-32 rounded-[2rem]" />
        </div>
        <Skeleton className="h-[500px] rounded-[3rem]" />
      </div>
    );
  }

  const { product, stats, history } = data || {};

  const columns = [
    {
      label: "Customer Identity",
      render: (item) => (
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-muted overflow-hidden border border-border">
            <img 
              src={getImageUrl(item.customer?.avatar)} 
              alt="" 
              className="w-full h-full object-cover"
              onError={(e) => e.target.src = "/placeholder-avatar.png"}
            />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-foreground leading-none mb-1">
              {item.customer?.name}
            </p>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
              {item.isGuest ? "GUEST TRANSMISSION" : "VERIFIED ACCOUNT"}
            </p>
          </div>
        </div>
      )
    },
    {
      label: "Quantity",
      render: (item) => (
        <div className="flex items-center gap-2">
           <span className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-xs">
              {item.quantity}
           </span>
           <span className="text-[9px] font-black text-muted-foreground uppercase">Units</span>
        </div>
      )
    },
    {
      label: "Settlement",
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-xs font-black text-foreground">৳{item.total.toLocaleString()}</span>
          <span className="text-[8px] font-bold text-muted-foreground uppercase">@{item.price}</span>
        </div>
      )
    },
    {
      label: "Temporal Data",
      render: (item) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar size={12} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">
             {new Date(item.date).toLocaleDateString()} - {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      )
    },
    {
        label: "Status",
        render: (item) => <StatusBadge value={item.orderStatus} />
    },
    {
      label: "Protocol",
      render: (item) => (
        <Link 
          href={`/admin/orders/${item.orderId}`}
          className="text-[9px] font-black text-primary uppercase underline hover:text-primary/70 transition-all tracking-[0.2em]"
        >
          View Order →
        </Link>
      )
    }
  ];

  return (
    <div className="admin-page-container pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-6">
          <Link href="/admin/products">
            <Button variant="ghost" className="h-12 w-12 rounded-full border border-border/50 hover:bg-muted">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-2">
                <History className="text-primary" size={24} strokeWidth={3} />
                <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter uppercase italic leading-none">
                  Product <span className="text-muted-foreground/30">Audit</span>
                </h1>
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] ml-1">
              History Log for: <span className="text-primary">{product?.name}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-card p-3 rounded-[2rem] border border-border shadow-xl">
           <div className="h-14 w-14 rounded-2xl overflow-hidden border border-border">
             <img src={getImageUrl(product?.images?.[0])} className="w-full h-full object-cover grayscale" />
           </div>
           <div className="pr-6">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Price Marker</p>
              <p className="text-xl font-black text-foreground tracking-tight italic">৳{product?.price?.toLocaleString()}</p>
           </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
         <StatsCard 
            label="Total Circulation" 
            value={stats?.totalSold} 
            unit="Units" 
            icon={<PackageCheck className="text-emerald-500" />} 
            description="Cumulative items sold"
         />
         <StatsCard 
            label="Gross Settlement" 
            value={`৳${stats?.totalRevenue?.toLocaleString()}`} 
            icon={<TrendingUp className="text-primary" />} 
            description="Total revenue generated"
         />
         <StatsCard 
            label="Transmission Count" 
            value={stats?.orderCount} 
            unit="Orders" 
            icon={<ShoppingCart className="text-indigo-500" />} 
            description="Distinct purchase events"
         />
         <StatsCard 
            label="Avg Velocity" 
            value={(stats?.totalRevenue / (stats?.orderCount || 1)).toFixed(0)} 
            unit="৳/Order" 
            icon={<CreditCard className="text-amber-500" />} 
            description="Revenue per transaction"
         />
      </div>

      {/* Audit Log Table */}
      <div className="admin-table-form overflow-hidden border border-border/50 bg-background/50 backdrop-blur-xl rounded-[3rem] shadow-2xl">
         <div className="p-8 border-b border-border/10">
            <h2 className="text-xs font-black text-foreground uppercase tracking-[0.4em] flex items-center gap-3">
               <History size={14} className="text-primary" />
               Complete Sales Ledger
            </h2>
         </div>
         <div className="p-2">
            <DataTable 
                columns={columns} 
                data={history || []} 
                className="border-none bg-transparent"
            />
         </div>
         {history?.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center opacity-30 text-center">
                <PackageCheck size={64} strokeWidth={1} className="mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.5em]">No Sales Record Found</p>
            </div>
         )}
      </div>
    </div>
  );
}

function StatsCard({ label, value, unit, icon, description }) {
  return (
    <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity scale-[2] group-hover:scale-[2.5] duration-700">
         {icon}
      </div>
      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-4">
        {label}
      </p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-4xl font-black text-foreground tracking-tighter italic leading-none mb-2">
          {value}
        </h3>
        {unit && <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{unit}</span>}
      </div>
      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-50">
        {description}
      </p>
    </div>
  );
}
