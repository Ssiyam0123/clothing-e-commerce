import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function CategoryItem({ isSelected, onClick, label, icon, image }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-3 group transition-all duration-500 outline-none",
        isSelected ? "scale-105" : "hover:scale-105"
      )}
    >
      <div className={cn(
        "w-20 h-20 sm:w-24 sm:h-24 rounded-[2rem] overflow-hidden flex items-center justify-center transition-all duration-500 border-2 relative shadow-sm",
        isSelected 
          ? "border-primary bg-primary/[0.03] shadow-lg shadow-primary/10" 
          : "border-border/40 bg-card hover:border-primary/40 hover:shadow-md"
      )}>
        {image ? (
          <Image
            src={image}
            alt={label}
            width={96}
            height={96}
            className={cn(
              "w-full h-full object-cover transition-transform duration-700",
              isSelected ? "scale-110" : "group-hover:scale-110"
            )}
          />
        ) : (
          <div className={cn(
            "transition-colors duration-300",
            isSelected ? "text-primary" : "text-muted-foreground group-hover:text-primary"
          )}>
            {icon}
          </div>
        )}
        
        {isSelected && (
          <motion.div 
            layoutId="active-category"
            className="absolute inset-0 border-4 border-primary/20 pointer-events-none rounded-[1.8rem]"
          />
        )}
      </div>
      
      <span className={cn(
        "text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 text-center max-w-[100px] truncate",
        isSelected ? "text-primary" : "text-foreground group-hover:text-primary"
      )}>
        {label}
      </span>
    </button>
  );
}
