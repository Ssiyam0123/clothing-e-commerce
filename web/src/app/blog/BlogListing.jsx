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
        {/* 📑 The Journal Grid - Unified Standard Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
          {posts?.map((post) => (
            <div key={post._id} className="group h-full">
              <Link href={`/blog/${post.slug}`} className="flex flex-col h-full space-y-6 group">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-accent/20 border border-border/10 shadow-lg group-hover:shadow-rose-500/10 transition-all duration-700">
                  <Image
                    src={getImageUrl(post.featuredImage, 600, 80)}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                
                <div className="flex flex-col flex-grow space-y-4 px-1">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] bg-rose-600/10 text-rose-600 border-none">
                      {post.category || "Intel"}
                    </Badge>
                    <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">
                      <Clock size={10} />
                      <span>{post.readingTime?.replace(/read/i, '').trim() || "5M"} Read</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-tight group-hover:text-rose-600 transition-colors line-clamp-2 min-h-[3rem]">
                    {post.title}
                  </h3>
                  
                  <div className="pt-2 mt-auto border-t border-border/5 flex items-center justify-between text-[8px] font-bold uppercase tracking-widest text-muted-foreground/40">
                    <span className="flex items-center gap-2">
                      <User size={10} />
                      {post.author?.name || "Vanguard"}
                    </span>
                    <ArrowUpRight size={12} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
