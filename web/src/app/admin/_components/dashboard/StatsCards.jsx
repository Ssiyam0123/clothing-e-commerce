"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Users, Package, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatsCards({ revenue, customers, inventory, recentOrdersCount, isLoading }) {
  const stats = [
    {
      label: "Total Sales",
      value: revenue ? `৳${revenue.total.toLocaleString()}` : null,
      icon: <TrendingUp className="h-4 w-4 text-primary" />,
      description: "Total revenue this year",
    },
    {
      label: "Forecast",
      value: revenue?.forecast ? `৳${revenue.forecast.toLocaleString()}` : "৳0",
      icon: <TrendingUp className="h-4 w-4 text-green-500" />,
      description: "Predicted month-end revenue",
    },
    {
      label: "Retention",
      value: `${customers?.retentionRate || 0}%`,
      icon: <Users className="h-4 w-4 text-blue-500" />,
      description: "Returning customers rate",
    },
    {
      label: "Total Products",
      value: inventory?.totalProducts,
      icon: <Package className="h-4 w-4 text-primary" />,
      description: "Total items in stock",
    },
    {
      label: "Recent Orders",
      value: recentOrdersCount,
      icon: <ShoppingCart className="h-4 w-4 text-primary" />,
      description: "Order volume recently",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat, i) => (
        <Card key={i} className="border border-border shadow-sm bg-card rounded-[2rem] transition-all hover:shadow-xl hover:scale-[1.03]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
              {stat.label}
            </CardTitle>
            <div className="p-2 bg-primary/5 rounded-lg">
              {stat.icon}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            ) : (
              <>
                <div className="text-4xl font-black tracking-tighter text-foreground italic">
                  {stat.value || "0"}
                </div>
                <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest mt-1 opacity-70">
                  {stat.description}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
