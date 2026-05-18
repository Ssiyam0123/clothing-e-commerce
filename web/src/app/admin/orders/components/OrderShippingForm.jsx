"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function OrderShippingForm({ 
  register, 
  errors, 
  values = {}, 
  onChange 
}) {
  const isHookForm = typeof register === "function";

  const getBind = (name, requiredMessage) => {
    if (isHookForm) {
      return register(name, requiredMessage ? { required: requiredMessage } : {});
    }
    return {
      value: values[name] || "",
      onChange: (e) => onChange && onChange(name, e.target.value)
    };
  };

  const getError = (name) => {
    return isHookForm && errors ? errors[name]?.message : null;
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-2">
        <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">
          Full Name
        </Label>
        <Input 
          {...getBind("name", "Name is required")}
          placeholder="Customer Full Name"
          className="h-14 bg-muted/30 border-border/50 rounded-xl px-6 text-xs font-bold focus:ring-2 focus:ring-indigo-600/20 text-foreground"
        />
        {getError("name") && (
          <span className="text-rose-500 text-[10px] font-bold mt-1 ml-1">{getError("name")}</span>
        )}
      </div>

      <div className="grid gap-2">
        <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">
          Email Address
        </Label>
        <Input 
          type="email"
          {...getBind("email", "Email is required")}
          placeholder="Customer Email Address"
          className="h-14 bg-muted/30 border-border/50 rounded-xl px-6 text-xs font-bold focus:ring-2 focus:ring-indigo-600/20 text-foreground"
        />
        {getError("email") && (
          <span className="text-rose-500 text-[10px] font-bold mt-1 ml-1">{getError("email")}</span>
        )}
      </div>

      <div className="grid gap-2">
        <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">
          Phone Number
        </Label>
        <Input 
          {...getBind("phone", "Phone number is required")}
          placeholder="Customer Phone Number"
          className="h-14 bg-muted/30 border-border/50 rounded-xl px-6 text-xs font-bold focus:ring-2 focus:ring-indigo-600/20 text-foreground border-indigo-500/20"
        />
        {getError("phone") && (
          <span className="text-rose-500 text-[10px] font-bold mt-1 ml-1">{getError("phone")}</span>
        )}
      </div>

      <div className="grid gap-2">
        <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">
          Shipping Address
        </Label>
        <Textarea 
          {...getBind("address", "Shipping address is required")} 
          placeholder="Full Shipping Address / Landmark"
          className="bg-muted/30 border border-border/50 rounded-xl p-6 text-xs font-bold focus:ring-2 focus:ring-indigo-600/20 min-h-[100px] resize-none text-foreground placeholder:text-muted-foreground/50" 
        />
        {getError("address") && (
          <span className="text-rose-500 text-[10px] font-bold mt-1 ml-1">{getError("address")}</span>
        )}
      </div>
    </div>
  );
}
