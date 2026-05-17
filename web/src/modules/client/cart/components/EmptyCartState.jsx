import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmptyCartState({ t }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8 bg-background">
      <div className="w-32 h-32 glass rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl animate-in zoom-in duration-1000">
        <ShoppingBag size={40} className="text-muted-foreground/20" />
      </div>
      <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter italic text-gradient mb-10 leading-none">
        {t.emptyVault || "Vault is Empty"}
      </h2>
      <Button
        asChild
        className="h-14 px-12 rounded-full bg-foreground text-background font-black uppercase text-[10px] tracking-[0.3em] hover:bg-accent-secondary hover:text-white transition-all shadow-2xl"
      >
        <Link href="/products">
          {t.exploreDrops || "Explore Drops"}
        </Link>
      </Button>
    </div>
  );
}
