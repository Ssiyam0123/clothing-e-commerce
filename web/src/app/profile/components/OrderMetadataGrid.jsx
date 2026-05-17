import { Calendar, CreditCard, MapPin, Truck } from "lucide-react";

export default function OrderMetadataGrid({ order }) {
  return (
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
                  {order.shippingAddress.address}<br />
                  <span className="text-muted-foreground font-medium text-xs">{order.shippingAddress.phone}</span>
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
  );
}
