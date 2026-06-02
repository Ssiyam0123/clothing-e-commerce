import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function CategoryItem({ isSelected, onClick, label, icon, image }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex h-14 min-w-[112px] items-center gap-2 rounded-2xl border px-2 pr-4 text-left outline-none transition-all sm:h-16 sm:min-w-[140px]",
        isSelected
          ? "border-foreground bg-foreground text-background shadow-lg"
          : "border-border bg-background text-foreground hover:border-foreground/30 hover:bg-muted/30",
      )}
    >
      <span
        className={cn(
          "relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl sm:size-11",
          isSelected ? "bg-background/15" : "bg-muted",
        )}
      >
        {image ? (
          <Image
            src={image}
            alt={label}
            width={52}
            height={52}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <span className={cn(isSelected ? "text-background" : "text-muted-foreground")}>
            {icon}
          </span>
        )}
      </span>

      <span className="min-w-0">
        <span className="block max-w-[86px] truncate text-[10px] font-black uppercase tracking-[0.14em] sm:max-w-[104px]">
          {label}
        </span>
      </span>

      {isSelected && (
        <motion.span
          layoutId="active-category"
          className="absolute inset-0 rounded-2xl ring-2 ring-foreground/15"
        />
      )}
    </button>
  );
}
