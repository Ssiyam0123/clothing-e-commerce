import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function LogisticsInput({ label, value, onChange, placeholder, icon }) {
  return (
    <div className="space-y-2 sm:space-y-3">
      <Label className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] ml-2 text-muted-foreground">{label}</Label>
      <div className="relative">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/50">
          {icon}
        </div>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-accent/20 border-none h-14 sm:h-16 pl-12 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest focus-visible:ring-2 focus-visible:ring-accent-secondary/50 shadow-inner"
        />
      </div>
    </div>
  );
}
