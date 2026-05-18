import { User, Mail, Phone } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import LogisticsInput from "@/app/cart/components/LogisticsInput";

export default function CartLogisticsForm({
  t,
  settings,
  shippingInfo,
  setShippingInfo,
  deliveryZone,
  setDeliveryZone
}) {
  const activeCouriers = settings?.shipping?.couriers?.filter(c => c.isActive) || [];

  return (
    <section className="space-y-8 sm:space-y-12">
      <div className="space-y-1 border-b border-border/10 pb-4 sm:pb-6">
        <h2 className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.4em] sm:tracking-[0.5em] text-accent-secondary">
          02. {t.destination || "Destination"}
        </h2>
        <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">{t.deploymentLogistics || "Deployment Logistics"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
        <LogisticsInput 
          label={t.fullIdentity || "Full Identity"} 
          value={shippingInfo.name} 
          onChange={(v) => setShippingInfo({ ...shippingInfo, name: v })}
          placeholder={t.namePlaceholder || "Enter your full name"}
          icon={<User size={16} />}
        />
        <LogisticsInput 
          label={t.emailAddress || "Email Address"} 
          value={shippingInfo.email} 
          onChange={(v) => setShippingInfo({ ...shippingInfo, email: v })}
          placeholder={t.emailPlaceholder || "Enter your email"}
          icon={<Mail size={16} />}
        />
        <LogisticsInput 
          label={t.contactProtocol || "Contact Protocol"} 
          value={shippingInfo.phone} 
          onChange={(v) => setShippingInfo({ ...shippingInfo, phone: v })}
          placeholder={t.phonePlaceholder || "Enter phone number"}
          icon={<Phone size={16} />}
        />

        <div className="space-y-2 sm:space-y-3">
            <Label className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] ml-2 text-muted-foreground">{t.transitZone || "Transit Zone / Courier"}</Label>
            <RadioGroup 
              value={deliveryZone} 
              onValueChange={setDeliveryZone}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {activeCouriers.length > 0 ? (
                activeCouriers.map((c) => (
                  <div key={c.name} className="relative">
                    <RadioGroupItem value={c.name} id={c.name} className="peer sr-only" />
                    <Label
                      htmlFor={c.name}
                      className="flex flex-col items-start justify-center min-h-14 sm:min-h-16 rounded-xl sm:rounded-2xl border-2 border-transparent bg-accent/20 peer-data-[state=checked]:border-accent-secondary peer-data-[state=checked]:bg-accent-secondary/10 peer-data-[state=checked]:text-accent-secondary cursor-pointer transition-all hover:bg-accent/40 text-[9px] font-black uppercase tracking-wider text-left px-4 py-2"
                    >
                      <span className="text-[10px] tracking-tight truncate w-full text-foreground">{c.name}</span>
                      <span className="text-[8px] text-muted-foreground/80 mt-1 font-mono tracking-tight font-medium leading-none">BDT {c.charge} • {c.estimatedDays}</span>
                    </Label>
                  </div>
                ))
              ) : (
                ["dhaka", "outside"].map((z) => (
                  <div key={z} className="relative">
                    <RadioGroupItem value={z} id={z} className="peer sr-only" />
                    <Label
                      htmlFor={z}
                      className="flex flex-col items-center justify-center h-12 sm:h-14 rounded-xl sm:rounded-2xl border-2 border-transparent bg-accent/20 peer-data-[state=checked]:border-accent-secondary peer-data-[state=checked]:bg-accent-secondary/10 peer-data-[state=checked]:text-accent-secondary cursor-pointer transition-all hover:bg-accent/40 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-center px-2"
                    >
                      {t[z] || (z === 'dhaka' ? "Inside Dhaka" : "Outside Dhaka")}
                    </Label>
                  </div>
                ))
              )}
            </RadioGroup>
        </div>

        <div className="md:col-span-2 space-y-2 sm:space-y-3">
          <Label className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] ml-2 text-muted-foreground">{t.deploymentBase || "Full Address"}</Label>
          <Input
            value={shippingInfo.address}
            onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
            placeholder={t.addressPlaceholder || "Enter your full address"}
            className="bg-accent/20 border-none h-14 sm:h-16 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-[11px] uppercase tracking-widest focus-visible:ring-2 focus-visible:ring-accent-secondary/50 shadow-inner"
          />
        </div>
      </div>
    </section>
  );
}
