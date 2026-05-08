"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function InventoryAlerts({ inventory, isLoading }) {
  return (
    <Card className="bg-card rounded-[3rem] border border-border shadow-sm transition-all duration-500">
      <CardHeader>
        <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">
          Critical Stock Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center border-b border-border pb-4 last:border-0">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-8 w-8" />
            </div>
          ))
        ) : inventory.criticalItems.length > 0 ? (
          inventory.criticalItems.map((item, i) => (
            <div
              key={i}
              className="flex justify-between items-center border-b border-border pb-4 last:border-0"
            >
              <div>
                <p className="text-sm font-black uppercase tracking-tight text-foreground">
                  {item.name}
                </p>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-[8px] font-black px-2 py-0.5 rounded-sm border-none mt-1",
                    item.status === "OUT" 
                    ? "bg-destructive/20 text-destructive" 
                    : "bg-amber-500/20 text-amber-500"
                  )}
                >
                  {item.status === "OUT" ? "Deficit" : "Low Threshold"}
                </Badge>
              </div>
              <p
                className={cn(
                  "text-2xl font-black",
                  item.status === "OUT" ? "text-destructive" : "text-foreground"
                )}
              >
                {item.stock}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground text-[10px] font-black uppercase tracking-widest py-12">
            All stocks healthy
          </p>
        )}
        <Link
          href="/admin/products"
          className="block w-full text-center py-4 bg-foreground text-background hover:bg-foreground/90 rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] transition-all shadow-xl"
        >
          Sync Inventory Vault
        </Link>
      </CardContent>
    </Card>
  );
}
