import { getCategories } from "@/lib/categories";
import { getSettings } from "@/lib/settings";
import { getImageUrl } from "@/utils/imageUtils";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTranslation } from "@/utils/typography/handler";
import { cookies } from "next/headers";
import { Card } from "@/components/ui/card";

export async function generateMetadata() {
  const settings = await getSettings();
  const branding = settings?.branding || {};
  const siteName = branding.siteName || "VANGUARD";

  return {
    title: `Categories | ${siteName}`,
    description: "Explore our curated collections of premium artifacts and apparel.",
    openGraph: {
      title: `Categories - ${siteName}`,
      description: "Explore our curated collections of premium artifacts and apparel.",
    }
  };
}

export default async function CategoriesPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("vanguard-lang")?.value || "en";
  const t = getTranslation('categories', lang);

  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6 md:px-12">
      <div className="max-w-screen-2xl mx-auto">
        
        {/* 📟 Header Section */}
        <header className="mb-16 md:mb-24 space-y-4">
          <div className="flex items-center gap-3 text-accent-secondary animate-in fade-in slide-in-from-left-4 duration-700">
            <LayoutGrid size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">{t.allCategories}</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter italic leading-none animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            {t.title} <span className="text-muted-foreground opacity-30">Hub</span>
          </h1>
          <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-[10px] max-w-xl opacity-60 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            {t.subtitle}
          </p>
        </header>

        {/* 🏢 Category Matrix - Mobile Optimized Archival Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {categories.map((cat, idx) => {
            const isOnSale = cat.slug === 'on-sale';
            
            return (
              <Card 
                key={cat._id || idx}
                className="relative aspect-[3/4] md:aspect-[4/5] min-h-[220px] md:min-h-[450px] w-full rounded-[1.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl select-none group border-none bg-elevated transition-all duration-700 md:hover:-translate-y-2"
              >
                <Link
                  href={`/products?category=${cat.slug || cat._id}&page=1`}
                  className="block w-full h-full"
                  aria-label={`Browse ${cat.name} category`}
                >
                  {/* Background Image with advanced hover */}
                  <div className="absolute inset-0 transition-all duration-[1.5s] ease-out md:group-hover:scale-110 md:group-hover:rotate-1">
                    {isOnSale ? (
                      <div className="absolute inset-0 bg-rose-600/20">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-500/30 via-transparent to-transparent opacity-60" />
                      </div>
                    ) : (
                      <img
                        src={getImageUrl(cat.image || "/placeholder-cat.jpg", 800, 80)}
                        alt={cat.name}
                        className="absolute inset-0 w-full h-full object-cover grayscale-[50%] md:grayscale-[100%] contrast-125 transition-all duration-700 md:group-hover:grayscale-0 md:group-hover:contrast-100"
                        loading="lazy"
                      />
                    )}
                  </div>

                  {/* Multi-layered Overlay */}
                  <div className={cn(
                    "absolute inset-0 transition-opacity duration-700",
                    isOnSale ? "bg-gradient-to-t from-rose-950/90 via-rose-900/20 to-transparent opacity-90" : "bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 md:group-hover:opacity-40"
                  )} />
                  
                  {/* Content Container */}
                  <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-10 z-10">
                    <div className="translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-500 ease-out">
                      <div className="inline-flex items-center gap-2 mb-2 md:mb-3">
                        <span className={cn("w-6 md:w-8 h-[1px]", isOnSale ? "bg-rose-500" : "bg-accent-secondary")} />
                        <span className={cn(
                          "text-[7px] md:text-[10px] font-black tracking-[0.4em] uppercase",
                          isOnSale ? "text-rose-500" : "text-accent-secondary"
                        )}>
                          {isOnSale ? "Offer" : "Syndicate"}
                        </span>
                      </div>
                      
                      <div className="relative">
                        <h3 className="text-xl md:text-5xl font-black text-white uppercase tracking-tighter leading-[0.85] italic mb-3 md:mb-4 drop-shadow-2xl">
                          {cat.name}
                        </h3>
                        
                        <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-white/60 mb-4 md:mb-6">
                          {isOnSale ? t.onSaleDesc : `${cat.productCount || 0} ${t.items}`}
                        </p>

                        {/* Interactive Button - Permanent on Mobile */}
                        <div className="flex items-center gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 translate-x-0 md:-translate-x-4 md:group-hover:translate-x-0 transition-all duration-500 delay-100">
                          <span className={cn(
                            "text-[8px] md:text-[9px] font-black uppercase tracking-widest backdrop-blur-md px-4 md:px-6 py-2 md:py-2.5 rounded-full border border-white/10 shadow-2xl transition-colors",
                            isOnSale ? "bg-rose-600 text-white" : "bg-white/10 md:bg-white/20 text-white md:hover:bg-white md:hover:text-black"
                          )}>
                            {t.viewCollection}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative index number - Scaled for Mobile */}
                  <div className="absolute top-4 right-4 md:top-10 md:right-10 text-white/10 text-4xl md:text-8xl font-black italic tracking-tighter select-none transition-transform duration-700 md:group-hover:scale-110 md:group-hover:-translate-x-2">
                    0{idx + 1}
                  </div>
                </Link>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
