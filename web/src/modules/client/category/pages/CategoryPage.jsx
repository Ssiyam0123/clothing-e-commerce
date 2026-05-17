import { getCategories } from "@/modules/client/category/lib/categoryApi";
import { LayoutGrid } from "lucide-react";
import { getTranslation } from "@/utils/typography/handler";
import { cookies } from "next/headers";
import CategoryMatrix from "@/modules/client/category/components/CategoryMatrix";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const CategoryMatrixSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <div key={i} className="aspect-[4/5] w-full rounded-[2.5rem] p-8 border border-border/5 bg-accent/5 flex flex-col justify-end space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/3 rounded-full" />
          <Skeleton className="h-10 w-2/3 rounded-2xl" />
          <Skeleton className="h-4 w-1/2 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);

export default async function CategoryPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("vanguard-lang")?.value || "en";
  const t = getTranslation('categories', lang);

  const categoriesPromise = getCategories();

  return (
    <div className="min-h-screen bg-background  px-6 pt-5">
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
        <Suspense fallback={<CategoryMatrixSkeleton />}>
          <CategoryMatrixWrapper categoriesPromise={categoriesPromise} />
        </Suspense>
      </div>
    </div>
  );
}

async function CategoryMatrixWrapper({ categoriesPromise }) {
  const categories = await categoriesPromise;
  return <CategoryMatrix categories={categories} />;
}
