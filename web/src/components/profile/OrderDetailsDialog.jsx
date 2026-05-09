"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useOrders } from "@/hooks/client/useOrders";
import { getImageUrl } from "@/utils/imageUtils";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, MapPin, CreditCard, Calendar, Truck, Printer, Download } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function OrderDetailsDialog({ orderId, open, onOpenChange, ui }) {
  const { orderDetails: order, orderDetailsLoading: loading } = useOrders(orderId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl h-[90vh] flex flex-col p-0 overflow-hidden bg-background border-border/20 rounded-[2rem] shadow-2xl">
        <DialogHeader className="p-6 sm:p-10 border-b border-border/10 bg-accent/5 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
             <div className="space-y-1.5 text-left">
                <div className="flex items-center gap-3">
                    <DialogTitle className="text-2xl sm:text-4xl font-black uppercase tracking-tighter italic">
                      Order_Report
                    </DialogTitle>
                    <div className="hidden sm:flex gap-2">
                        <button className="p-2 rounded-full hover:bg-accent/10 transition-colors text-muted-foreground"><Printer size={16}/></button>
                        <button className="p-2 rounded-full hover:bg-accent/10 transition-colors text-muted-foreground"><Download size={16}/></button>
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

        <ScrollArea className="flex-1">
          <div className="p-6 sm:p-10 pb-20 sm:pb-32">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4">
               <Loader2 className="w-10 h-10 animate-spin text-accent-secondary" />
               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground animate-pulse">Accessing Data Bank...</p>
            </div>
          ) : order ? (
            <div className="space-y-10 sm:space-y-16">
               {/* Metadata Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
                  <div className="space-y-6 sm:space-y-8">
                     <div className="flex gap-4 sm:gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0 shadow-inner">
                           <Calendar size={18} className="text-accent-secondary" />
                        </div>
                        <div className="space-y-1">
                           <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Initiation Date</p>
                           <p className="text-sm font-bold">{new Date(order.createdAt).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })}</p>
                        </div>
                     </div>

                     <div className="flex gap-4 sm:gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0 shadow-inner">
                           <CreditCard size={18} className="text-accent-secondary" />
                        </div>
                        <div className="space-y-1">
                           <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Settlement Method</p>
                           <p className="text-sm font-bold uppercase flex items-center gap-2">
                             {order.paymentMethod}
                             <span className="text-[9px] px-2 py-0.5 bg-accent/10 rounded-full text-muted-foreground">{order.paymentResult?.status || 'Pending'}</span>
                           </p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6 sm:space-y-8">
                     <div className="flex gap-4 sm:gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0 shadow-inner">
                           <MapPin size={18} className="text-accent-secondary" />
                        </div>
                        <div className="space-y-1">
                           <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Delivery Protocol</p>
                           <p className="text-sm font-bold leading-relaxed">
                              {order.shippingAddress.address}, {order.shippingAddress.city}<br />
                              <span className="text-muted-foreground font-medium text-xs">{order.shippingAddress.postalCode}, {order.shippingAddress.country}</span>
                           </p>
                        </div>
                     </div>

                     <div className="flex gap-4 sm:gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0 shadow-inner">
                           <Truck size={18} className="text-accent-secondary" />
                        </div>
                        <div className="space-y-1">
                           <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Logistics Status</p>
                           <p className="text-sm font-bold">{order.isDelivered ? `Delivered at ${new Date(order.deliveredAt).toLocaleDateString()}` : 'In Transit / Awaiting Drop'}</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Asset List */}
               <div className="space-y-6">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.4em] flex items-center gap-4 text-accent-secondary">
                     <span className="h-px w-8 bg-accent-secondary" /> Itemized Assets
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                     {order.orderItems.map((item, idx) => (
                        <div key={idx} className="group flex items-center gap-5 sm:gap-8 p-4 sm:p-6 rounded-[1.5rem] bg-accent/5 border border-border/10 hover:border-accent-secondary/30 transition-all duration-500">
                           <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl overflow-hidden bg-background border border-border/10 shrink-0 shadow-xl group-hover:scale-105 transition-transform duration-500">
                              <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
                           </div>
                           <div className="flex-1 min-w-0 space-y-2">
                              <p className="text-sm sm:text-base font-black uppercase tracking-tight line-clamp-1 group-hover:text-accent-secondary transition-colors">{item.name}</p>
                              <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                 <span className="px-3 py-1 bg-background rounded-full border border-border/50">Size: {item.size?.name || item.size || 'N/A'}</span>
                                 <span className="px-3 py-1 bg-background rounded-full border border-border/50">Qty: {item.quantity}</span>
                              </div>
                           </div>
                           <div className="text-right shrink-0">
                              <p className="text-sm sm:text-lg font-black text-primary tracking-tighter">৳{(item.price || 0).toFixed(0)}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Financial Breakdown */}
                <div className="p-8 sm:p-12 rounded-[2.5rem] bg-foreground text-background space-y-4 shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-accent-secondary/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-accent-secondary/20 transition-colors duration-1000" />
                   
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                      <span>Subtotal Value</span>
                      <span>৳{(order.itemsPrice || 0).toFixed(0)}</span>
                   </div>
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                      <span>Logistics Assessment</span>
                      <span>৳{(order.shippingPrice || 0).toFixed(0)}</span>
                   </div>
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                      <span>Government Taxation</span>
                      <span>৳{(order.taxPrice || 0).toFixed(0)}</span>
                   </div>
                   <div className="h-px bg-background/20 my-4" />
                   <div className="flex justify-between items-end">
                      <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-secondary">Settlement Total</p>
                          <p className="text-xs font-bold opacity-60 italic uppercase tracking-tighter">Verified Transaction</p>
                      </div>
                      <span className="text-3xl sm:text-5xl font-black tracking-tighter text-accent-secondary">৳{(order.totalPrice || 0).toFixed(0)}</span>
                   </div>
                </div>
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
