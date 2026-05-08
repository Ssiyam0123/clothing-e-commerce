import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/utils/imageUtils";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Clock, User } from "lucide-react";

export default function BlogListing({ posts, t }) {
  const featured = posts?.[0];
  const remaining = posts?.slice(1);

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* 📰 Journal Header - Minimalist */}
      <header className="pt-20 pb-16 sm:pt-32 sm:pb-24 text-center space-y-6">
        <div className="flex justify-center">
          <Badge variant="outline" className="px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.4em] border-foreground/10 text-muted-foreground bg-accent/5">
            {t.protocol}
          </Badge>
        </div>
        
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none italic text-foreground">
          {t.journal}
        </h1>
        
        <p className="max-w-md mx-auto text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.4em] text-muted-foreground/60">
          {t.narrative}
        </p>
      </header>

      <div className="max-w-screen-xl mx-auto px-6">
        {/* 🌟 Featured Article - The Main Narrative */}
        {featured && (
          <div className="mb-24 sm:mb-32 group">
            <Link href={`/blog/${featured.slug}`} className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[2.5rem] shadow-2xl border border-border/5">
                <Image
                  src={getImageUrl(featured.featuredImage, 1200, 85)}
                  alt={featured.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  priority
                />
              </div>
              <div className="space-y-8">
                <Badge className="bg-rose-600 text-white px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-none">
                  Featured Intelligence
                </Badge>
                <h2 className="text-4xl sm:text-6xl font-black uppercase italic tracking-tighter leading-[0.9] group-hover:text-rose-500 transition-colors duration-500">
                  {featured.title}
                </h2>
                <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <span>{featured.author?.name || "Vanguard"}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                  <span>{featured.readingTime?.replace(/read/i, '').trim()} Read</span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* 📑 The Journal Grid - Minimalist Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-16">
          {remaining?.map((post) => (
            <div key={post._id} className="group">
              <Link href={`/blog/${post.slug}`} className="space-y-6 block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-accent/20 border border-border/5">
                  <Image
                    src={getImageUrl(post.featuredImage, 600, 80)}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-rose-600">
                      {post.category}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                      {post.readingTime?.replace(/read/i, '').trim()} Read
                    </span>
                  </div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-tight group-hover:text-rose-600 transition-colors">
                    {post.title}
                  </h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
