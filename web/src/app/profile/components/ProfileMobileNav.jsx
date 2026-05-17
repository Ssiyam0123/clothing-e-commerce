import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ProfileMobileNav({ navItems }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-lg">
      <nav className="bg-background/80 backdrop-blur-2xl border border-border/10 p-2 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-around overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-accent-secondary/5 -z-10" />
        
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex flex-col items-center gap-1.5 py-3 px-5 rounded-2xl transition-all duration-500 flex-1",
              item.active 
                ? "text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.active && (
              <motion.div
                layoutId="mobileActiveNav"
                className="absolute inset-0 bg-accent/10 -z-10 rounded-2xl"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            
            <item.icon className={cn(
              "w-5 h-5 transition-all duration-500",
              item.active ? "text-accent-secondary scale-110" : "group-hover:scale-110"
            )} />
            <span className={cn(
              "text-[8px] font-black uppercase tracking-widest",
              item.active ? "opacity-100" : "opacity-60"
            )}>
              {item.label.split(' ')[1] || item.label}
            </span>

            {item.active && (
              <motion.div 
                layoutId="activeIndicator"
                className="absolute -bottom-1 w-1 h-1 bg-accent-secondary rounded-full" 
              />
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
}
