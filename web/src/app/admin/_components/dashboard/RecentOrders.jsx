"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import StatusBadge from "@/app/admin/_components/StatusBadge";
import { cn } from "@/lib/utils";

export function RecentOrders({ recentOrders, isLoading }) {
  return (
    <Card className="bg-card rounded-[3rem] border border-border shadow-sm transition-all duration-500">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">
          Recent Orders
        </CardTitle>
        <Link
          href="/admin/orders"
          className="text-[9px] font-black text-primary hover:text-primary/80 uppercase tracking-widest transition-colors"
        >
          View All →
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-5 rounded-3xl bg-muted/30 border border-border">
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-2 w-16" />
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))
        ) : (
          recentOrders.map((order) => (
            <div
              key={order._id}
              className="flex items-center justify-between p-5 rounded-3xl bg-muted/30 border border-border hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center font-black text-muted-foreground group-hover:text-primary transition-colors">
                  {order.user?.name?.charAt(0) || "G"}
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-foreground">
                    {order.user?.name || "Guest"}
                  </p>
                  <p className="text-[8px] font-bold text-muted-foreground tracking-widest">
                    #{order._id.slice(-6).toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-foreground">
                  ৳{order.totalPrice?.toFixed(0)}
                </p>
                <div className="mt-1">
                   <StatusBadge value={order.orderStatus} />
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
