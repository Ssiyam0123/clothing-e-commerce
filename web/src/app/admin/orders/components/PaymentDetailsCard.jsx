import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function PaymentDetailsCard({ order }) {
  if (!order) return null;

  return (
    <Card className="bg-muted/30 rounded-[2.5rem] border-border p-8 shadow-inner">
      <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-6">
        03. Payment Details
      </h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center py-3 border-b border-border">
          <span className="text-[10px] font-black text-muted-foreground uppercase">
            Payment Status
          </span>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full animate-pulse",
                order.paymentResult?.status === "Completed" ? "bg-emerald-500" : "bg-amber-500"
              )}
            />
            <span
              className={cn(
                "text-[10px] font-black uppercase",
                order.paymentResult?.status === "Completed" ? "text-emerald-500" : "text-amber-500"
              )}
            >
              {order.paymentResult?.status || "In Transit"}
            </span>
          </div>
        </div>
        {order.paymentResult?.transactionId && (
          <div className="pt-2">
            <p className="text-[9px] font-black text-muted-foreground uppercase mb-2">
              Transaction ID
            </p>
            <p className="font-mono text-[10px] font-bold text-foreground break-all bg-card p-4 rounded-2xl border border-border">
              {order.paymentResult.transactionId}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
