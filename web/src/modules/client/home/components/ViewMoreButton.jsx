import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ViewMoreButton({ href, label }) {
  return (
    <div className="flex justify-center mt-12">
      <Link 
        href={href} 
        className="group flex items-center gap-4 px-10 py-5 rounded-full bg-foreground text-background font-black text-[10px] uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-all duration-500 shadow-xl hover:shadow-primary/20"
      >
        {label} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
