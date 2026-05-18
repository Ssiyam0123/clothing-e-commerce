import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/utils/imageUtils";
import { Mail, Phone, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OrderCustomerDetailsCard({
  order,
  customerName,
  customerEmail,
  isRegistered,
}) {
  if (!order) return null;

  return (
    <Card className="rounded-[2.5rem] border-border bg-card p-8 shadow-sm">
      <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-8">
        02. Account Holder
      </h3>
      <div className="flex items-center gap-5 mb-10">
        <div className="h-20 w-20 rounded-[2rem] bg-muted flex items-center justify-center font-black text-muted-foreground border border-border text-3xl shadow-inner overflow-hidden uppercase">
          {order.user?.avatar ? (
            <img
              src={getImageUrl(order.user.avatar)}
              className="w-full h-full object-cover grayscale"
              alt="Avatar"
            />
          ) : (
            customerName.charAt(0)
          )}
        </div>
        <div>
          <p className="font-black text-2xl text-foreground uppercase tracking-tighter italic leading-tight">
            {customerName}
          </p>
          <Badge
            variant="outline"
            className={cn(
              "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border mt-1",
              isRegistered
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-muted text-muted-foreground border-border"
            )}
          >
            {isRegistered ? "Registered User" : "Guest User"}
          </Badge>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <Mail size={16} className="text-muted-foreground mt-1" />
          <div>
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">
              Email Address
            </p>
            <p className="text-xs font-bold text-foreground break-all">
              {customerEmail}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <Phone size={16} className="text-muted-foreground mt-1" />
          <div>
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">
              Phone Number
            </p>
            <p className="text-xs font-bold text-foreground">
              {order.shippingAddress?.phone}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <MapPin size={16} className="text-muted-foreground mt-1" />
          <div>
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">
              Delivery Address
            </p>
            <p className="text-xs font-bold text-foreground leading-relaxed uppercase">
              <span className="text-[10px] text-muted-foreground mr-2 font-black italic underline decoration-blue-600/30">Recipient:</span>{" "}
              {order.shippingAddress?.name}
            </p>
            <p className="text-xs font-bold text-foreground leading-relaxed uppercase mt-1">
              {order.shippingAddress?.address}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
