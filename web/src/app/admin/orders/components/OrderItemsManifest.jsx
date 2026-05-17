import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getImageUrl } from "@/utils/imageUtils";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OrderItemsManifest({ order }) {
  if (!order) return null;

  return (
    <Card className="rounded-[2.5rem] border-border bg-card p-4 md:p-8 shadow-sm">
      <CardHeader className="px-4 pb-10">
        <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] border-b border-border pb-4">
          01. Products Ordered
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 px-4">
        {order.orderItems?.map((item, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row items-center gap-8 p-6 rounded-3xl bg-muted/30 border border-border/50 group transition-all hover:bg-muted/50"
          >
            <div className="h-32 w-24 bg-muted rounded-2xl overflow-hidden shrink-0 border border-border shadow-inner">
              <img
                src={getImageUrl(item.image || item.product?.images?.[0])}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                alt={item.name}
              />
            </div>
            <div className="flex-1 text-center sm:text-left space-y-2">
              <p className="font-black text-foreground uppercase tracking-tight text-xl italic">
                {item.name}
              </p>
              <p className="text-[9px] font-black text-primary uppercase tracking-widest">
                Price per unit: ৳{item.price}
              </p>
            </div>
            <div className="flex items-center gap-10">
              <div className="text-center">
                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
                  Quantity
                </p>
                <p className="text-3xl font-black text-foreground">
                  ×{item.quantity}
                </p>
              </div>
              <div className="text-right min-w-[100px]">
                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
                  Subtotal
                </p>
                <p className="text-2xl font-black text-foreground tracking-tighter">
                  ৳{(item.price * item.quantity).toFixed(0)}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* FINANCIAL SUMMARY */}
        <div className="mt-12 pt-10 border-t border-border flex flex-col md:flex-row justify-between gap-10">
          <div className="space-y-4 flex-1">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <span>Subtotal</span>
              <span className="text-foreground">
                ৳{order.itemsPrice?.toFixed(0)}
              </span>
            </div>
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <span>Delivery Charge</span>
              <span className="text-foreground">
                ৳{order.shippingPrice?.toFixed(0)}
              </span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-emerald-500">
                <span>Voucher Discount</span>
                <span>- ৳{order.discountAmount.toFixed(0)}</span>
              </div>
            )}
          </div>
          <div className="md:text-right md:border-l border-border md:pl-12">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-2">
              Grand Total
            </p>
            <p className="text-6xl md:text-7xl font-black text-foreground tracking-tighter leading-none italic">
              ৳{order.totalPrice?.toFixed(0)}
            </p>
            <div className="flex items-center md:justify-end gap-2 mt-4 text-[10px] font-black uppercase text-muted-foreground">
              <ShieldCheck size={14} className="text-emerald-500" />
              Secured by {order.paymentMethod}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
