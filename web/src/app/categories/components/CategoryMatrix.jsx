import Link from "next/link";
import { Card } from "@/components/ui/card";
import { getImageUrl } from "@/utils/imageUtils";

export default function CategoryMatrix({ categories }) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
      {categories.map((cat, idx) => {
        const isOnSale = cat.slug === 'on-sale';
        
        return (
          <Card 
            key={cat._id || idx}
            className="relative aspect-[3/4] md:aspect-square min-h-[220px] md:min-h-[380px] w-full rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl select-none group border-none bg-elevated transition-all duration-700 md:hover:-translate-y-2"
          >
            <Link
              href={`/products?category=${cat.slug || cat._id}&page=1`}
              className="block w-full h-full"
              aria-label={`Browse ${cat.name} category`}
            >
              {/* Simple Background Image */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={isOnSale ? "/images/sale-banner.png" : getImageUrl(cat.image || "/placeholder-cat.jpg", 800, 80)}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-105"
                  loading="lazy"
                />
                {/* Soft Gradient for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
              </div>

              {/* Minimalist "Offer" Badge */}
              {isOnSale && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-rose-600 text-white text-[8px] md:text-[10px] font-bold uppercase tracking-wider px-3 py-1 md:px-4 md:py-1.5 rounded-full shadow-lg">
                    Offer
                  </span>
                </div>
              )}

              {/* Minimalist Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-10 z-10">
                <div className="space-y-1 md:space-y-2">
                  <h3 className="text-xl md:text-5xl font-black text-white uppercase tracking-tighter leading-tight drop-shadow-xl">
                    {cat.name}
                  </h3>
                  <div className="w-10 md:w-16 h-1 bg-accent-secondary rounded-full transform origin-left transition-transform duration-500 scale-x-50 md:group-hover:scale-x-100" />
                </div>
              </div>
            </Link>
          </Card>
        );
      })}
    </div>
  );
}
