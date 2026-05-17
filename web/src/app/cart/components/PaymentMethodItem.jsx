import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function PaymentMethodItem({ id, title, icon, active }) {
  return (
    <div className="relative">
      <RadioGroupItem value={id} id={id} className="peer sr-only" />
      <Label
        htmlFor={id}
        className={cn(
          "flex items-center gap-4 p-4 sm:p-5 rounded-xl sm:rounded-[1.8rem] border-2 cursor-pointer transition-all duration-500",
          active 
            ? "border-foreground bg-foreground/5 shadow-xl scale-[1.01]" 
            : "border-border/10 bg-transparent opacity-40 hover:opacity-100"
        )}
      >
        <div className={cn(
          "w-10 h-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-all",
          active ? "bg-foreground text-background" : "glass"
        )}>
          {icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest">{title}</span>
        {active && (
          <div className="ml-auto w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,1)]" />
        )}
      </Label>
    </div>
  );
}
