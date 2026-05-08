import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function AdminHeader({ isFetching, todayRevenue, isLoading }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
      <div>
        <h1 className="text-4xl md:text-7xl font-black text-foreground tracking-tighter uppercase italic leading-none mb-4">
          Vanguard <span className="text-muted-foreground/30">HQ</span>
        </h1>
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "h-2 w-2 rounded-full transition-all duration-500",
              isFetching 
              ? "bg-primary animate-pulse" 
              : "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
            )}
          />
          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.4em]">
            {isFetching ? "Updating Trajectory..." : "System Nominal"}
          </p>
        </div>
      </div>

      <div className="bg-card text-card-foreground border border-border p-6 rounded-[2rem] shadow-xl min-w-[240px] transition-all hover:scale-[1.02]">
        <p className="text-[9px] font-black text-muted-foreground uppercase mb-1 tracking-[0.2em]">
          Settlement Today
        </p>
        {isLoading ? (
          <Skeleton className="h-9 w-32 bg-emerald-500/10" />
        ) : (
          <p className="text-3xl font-black text-emerald-500 tracking-tighter">
            ৳{todayRevenue.toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
