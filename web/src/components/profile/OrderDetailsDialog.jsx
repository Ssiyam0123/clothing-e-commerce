"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useOrders } from "@/hooks/useOrders";
import { getImageUrl } from "@/utils/imageUtils";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, MapPin, CreditCard, Calendar, Truck } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function OrderDetailsDialog({ orderId, open, onOpenChange, ui }) {
  const { orderDetails: order, orderDetailsLoading: loading } = useOrders({}, orderId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0 overflow-hidden bg-background border-border/20 rounded-[2rem]">
        <DialogHeader className="p-8 border-b border-border/10 bg-accent/5">
          <div className="flex items-center justify-between gap-4">
             <div className="space-y-1">
                <DialogTitle className="text-3xl font-black uppercase tracking-tighter italic">
                  Archive_Report
                </DialogTitle>
                <DialogDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Detailed analysis of sequence #{orderId?.slice(-8).toUpperCase()}
                </DialogDescription>
             </div>
             {order && (
               <Badge className="px-6 py-2 rounded-full bg-foreground text-background text-[10px] font-black uppercase tracking-widest border-none">
                 {order.orderStatus}
               </Badge>
             )}
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 p-8">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4">
               <Loader2 className="w-10 h-10 animate-spin text-accent-secondary" />
               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground animate-pulse">Fetching Assets...</p>
            </div>
          ) : order ? (
            <div className="space-y-12">
               {/* Metadata Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                     <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                           <Calendar size={18} className="text-accent-secondary" />
                        </div>
                        <div className="space-y-1">
                           <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Initiation Date</p>
                           <p className="text-sm font-bold">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                     </div>

                     <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                           <CreditCard size={18} className="text-accent-secondary" />
                        </div>
                        <div className="space-y-1">
                           <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Settlement Method</p>
                           <p className="text-sm font-bold uppercase">{order.paymentMethod}</p>
                           <p className="text-[10px] font-medium text-muted-foreground">Status: {order.paymentResult?.status || 'Pending'}</p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                           <MapPin size={18} className="text-accent-secondary" />
                        </div>
                        <div className="space-y-1">
                           <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Delivery Protocol</p>
                           <p className="text-sm font-bold leading-relaxed">
                              {order.shippingAddress.address}, {order.shippingAddress.city}<br />
                              <span className="text-muted-foreground">{order.shippingAddress.postalCode}, {order.shippingAddress.country}</span>
                           </p>
                        </div>
                     </div>

                     <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                           <Truck size={18} className="text-accent-secondary" />
                        </div>
                        <div className="space-y-1">
                           <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Logistics Status</p>
                           <p className="text-sm font-bold">{order.isDelivered ? `Delivered at ${new Date(order.deliveredAt).toLocaleDateString()}` : 'Awaiting Final Drop'}</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Asset List */}
               <div className="space-y-6">
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3">
                     <Package size={14} className="text-accent-secondary" /> Itemized Assets
                  </h4>
                  <div className="space-y-4">
                     {order.orderItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-6 p-4 rounded-[1.5rem] bg-accent/5 border border-border/10">
                           <div className="w-16 h-20 rounded-xl overflow-hidden bg-background border border-border/10 shrink-0">
                              <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className="text-sm font-black uppercase tracking-tight line-clamp-1">{item.name}</p>
                              <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                                 <span>Size: {item.size || 'N/A'}</span>
                                 <span className="w-1 h-1 rounded-full bg-border" />
                                 <span>Qty: {item.quantity}</span>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-sm font-black text-primary">${item.price.toFixed(2)}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Financial Breakdown */}
               <div className="p-8 rounded-[2rem] bg-foreground text-background space-y-4">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                     <span>Subtotal</span>
                     <span>${order.itemsPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                     <span>Logistics Fee</span>
                     <span>${order.shippingPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                     <span>Taxation</span>
                     <span>${order.taxPrice.toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-background/20 my-2" />
                  <div className="flex justify-between items-end">
                     <span className="text-xs font-black uppercase tracking-[0.3em]">Total Value</span>
                     <span className="text-3xl font-black tracking-tighter text-accent-secondary">${order.totalPrice.toFixed(2)}</span>
                  </div>
               </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-20">Sequence data not found.</p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
