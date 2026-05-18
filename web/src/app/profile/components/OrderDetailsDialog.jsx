"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useProfileOrders } from "@/app/profile/lib/useProfileOrders";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, Printer, Download } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { downloadOrderReceipt } from "@/utils/orderReceipt";
import { notify } from "@/utils/swal";
import OrderMetadataGrid from "@/app/profile/components/OrderMetadataGrid";
import OrderAssetList from "@/app/profile/components/OrderAssetList";
import OrderFinancialBreakdown from "@/app/profile/components/OrderFinancialBreakdown";

export default function OrderDetailsDialog({ orderId, open, onOpenChange, ui, phone = null }) {
  const { orderDetails: order, orderDetailsLoading: loading } = useProfileOrders(orderId, phone);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!orderId || downloading) return;
    setDownloading(true);
    try {
      await downloadOrderReceipt(orderId, phone);
    } catch (err) {
      notify.error("Download failed", err.message || "Could not download receipt.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[80vh] h-full flex flex-col p-0 overflow-hidden bg-background border-border/20 rounded-[2rem] shadow-2xl">
        <DialogHeader className="p-6 sm:p-10 border-b border-border/10 bg-accent/5 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
             <div className="space-y-1.5 text-left">
                <div className="flex items-center gap-3">
                    <DialogTitle className="text-2xl sm:text-4xl font-black uppercase tracking-tighter italic">
                      Order_Report
                    </DialogTitle>
                    <div className="flex gap-2">
                        <button className="p-2 rounded-full hover:bg-accent/10 transition-colors text-muted-foreground" onClick={() => window.print()}><Printer size={16}/></button>
                        <button
                          className="p-2 rounded-full hover:bg-accent/10 transition-colors text-muted-foreground disabled:opacity-50"
                          onClick={handleDownload}
                          disabled={downloading}
                          aria-label="Download receipt"
                        >
                          {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16}/>}
                        </button>
                    </div>
                </div>
                <DialogDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent-secondary animate-pulse"/>
                  Detailed analysis of sequence #{orderId?.slice(-8).toUpperCase()}
                </DialogDescription>
             </div>
             {order && (
               <Badge className={cn(
                 "w-fit px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border-none shadow-lg",
                 order.orderStatus === "Delivered" ? "bg-emerald-500 text-white" : 
                 order.orderStatus === "Cancelled" ? "bg-rose-500 text-white" : "bg-amber-500 text-white"
               )}>
                 {order.orderStatus}
               </Badge>
             )}
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 w-full overflow-y-auto">
          <div className="p-6 sm:p-10 pb-20 sm:pb-32">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4">
               <Loader2 className="w-10 h-10 animate-spin text-accent-secondary" />
               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground animate-pulse">Accessing Data Bank...</p>
            </div>
          ) : order ? (
            <div className="space-y-10 sm:space-y-16">
               {/* Metadata Grid */}
               <OrderMetadataGrid order={order} />

               {/* Asset List */}
               <OrderAssetList order={order} />

               {/* Financial Breakdown */}
               <OrderFinancialBreakdown order={order} />
            </div>
          ) : (
            <div className="py-24 text-center space-y-4">
                <Package size={48} className="mx-auto text-muted-foreground/20" />
                <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Sequence data not found in archive.</p>
            </div>
          )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
