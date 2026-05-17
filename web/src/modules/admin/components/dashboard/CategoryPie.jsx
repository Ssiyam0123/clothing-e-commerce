"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

// HSL based colors for better consistency
const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent-secondary))",
  "oklch(0.646 0.222 41.116)", // Original accent-secondary fallback
  "oklch(0.6 0.118 184.704)", 
  "oklch(0.398 0.07 227.392)"
];

export function CategoryPie({ categories, isFetching, isLoading }) {
  return (
    <Card className="bg-card rounded-[3rem] border border-border shadow-sm relative overflow-hidden transition-all duration-500">
      {(isFetching && !isLoading) && (
        <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px] z-50 animate-in fade-in duration-300" />
      )}
      <CardHeader>
        <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] text-center">
          Sales by Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center gap-8">
            <Skeleton className="h-[200px] w-[200px] rounded-full" />
            <div className="w-full space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-8" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey="count"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    stroke="none"
                  >
                    {categories.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--popover)",
                      borderRadius: "16px",
                      border: "1px solid var(--border)",
                      boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
                      fontSize: "10px",
                      fontWeight: "900",
                      textTransform: "uppercase"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 space-y-3">
              {categories.slice(0, 4).map((cat, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest border-b border-border pb-2 last:border-0"
                >
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                    {cat.name}
                  </span>
                  <span className="text-foreground font-bold">{cat.count}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
