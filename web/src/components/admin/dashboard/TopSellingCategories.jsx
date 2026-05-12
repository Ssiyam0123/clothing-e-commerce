"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function TopSellingCategories({ categories, isLoading }) {
  if (isLoading) {
    return (
      <Card className="border border-border shadow-sm bg-card rounded-[2rem] overflow-hidden">
        <CardHeader>
          <CardTitle className="text-sm font-black uppercase tracking-widest italic">Top Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between h-4 w-full bg-muted animate-pulse rounded" />
              <div className="h-2 w-full bg-muted animate-pulse rounded" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const maxSales = categories.length > 0 ? Math.max(...categories.map(c => c.sales)) : 0;

  return (
    <Card className="border border-border shadow-sm bg-card rounded-[2rem] overflow-hidden flex flex-col h-full transition-all hover:shadow-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
          Most Sold Categories
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 flex-1">
        {categories.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-xs italic">
            No sales data yet
          </div>
        ) : (
          categories.map((cat, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between items-end">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-black italic uppercase tracking-tight">{cat.name}</h4>
                  <p className="text-[9px] text-muted-foreground font-bold tracking-widest uppercase opacity-70">
                    ৳{cat.revenue.toLocaleString()} Revenue
                  </p>
                </div>
                <div className="text-xl font-black italic tracking-tighter">
                  {cat.sales} <span className="text-[8px] uppercase not-italic">Sold</span>
                </div>
              </div>
              <Progress 
                value={(cat.sales / maxSales) * 100} 
                className="h-1.5 bg-primary/10" 
              />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
