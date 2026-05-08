"use client";

import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/utils/imageUtils";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, User } from "lucide-react";

export default function BlogMagazineClient({ posts, t }) {
  const featured = posts?.[0];
  const remaining = posts?.slice(1);

  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-32 pb-24 sm:pb-32 px-4 sm:px-6">
      <div className="max-w-[1400px] mx-auto">
        {/* 📰 Journal Header */}
        <header className="mb-16 sm:mb-24 text-center space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-1 rounded-full border border-border/10 bg-accent/30 backdrop-blur-md"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-accent-secondary animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground">{t.protocol}</span>
          </motion.div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase italic tracking-tighter leading-none text-gradient">
            Vanguard
            <br />
            <span className="text-foreground">{t.journal}</span>
          </h1>
          <p className="max-w-md mx-auto text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.4em] text-muted-foreground/60 leading-relaxed">
            {t.narrative}
          </p>
        </header>

        {/* 📚 Magazine Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Main Feature */}
          {featured && (
            <div className="lg:col-span-8 group">
              <Link
                href={`/blog/${featured.slug}`}
                className="block space-y-8"
              >
                <div className="relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden rounded-[2.5rem] sm:rounded-[3.5rem] bg-accent/20 shadow-2xl">
                  <Image
                    src={getImageUrl(featured.featuredImage, 1200, 85)}
                    alt={featured.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-[1.5s] ease-out group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                  <div className="absolute top-6 left-6 sm:top-10 sm:left-10">
                    <Badge className="bg-white text-black border-none px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-2xl">
                      {featured.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-500">
                    <ArrowUpRight size={24} />
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase italic tracking-tighter leading-[0.9] group-hover:text-accent-secondary transition-colors duration-500">
                    {featured.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-6 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    <div className="flex items-center gap-2">
                       <User size={12} className="text-accent-secondary" />
                       <span>{t.author} {featured.author?.name}</span>
                    </div>
                    <div className="w-1 h-1 bg-border rounded-full" />
                    <div className="flex items-center gap-2">
                       <Clock size={12} className="text-accent-secondary" />
                       <span>{featured.readingTime} {t.readingTime}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Sidebar – Latest Sequence */}
          <div className="lg:col-span-4 space-y-12">
            <div className="flex items-center gap-4">
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground whitespace-nowrap">
                 {t.latest}
               </h3>
               <div className="h-px flex-1 bg-border/20" />
            </div>

            <div className="grid grid-cols-1 gap-10">
              {remaining?.map((post) => (
                <Link
                  href={`/blog/${post.slug}`}
                  key={post._id}
                  className="flex gap-6 group items-center"
                >
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-3xl overflow-hidden shrink-0 bg-accent/20 shadow-xl">
                    <Image
                      src={getImageUrl(post.featuredImage, 300, 75)}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 96px, 128px"
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <div className="space-y-3">
                    <Badge variant="outline" className="text-[8px] font-black text-accent-secondary uppercase tracking-widest border-accent-secondary/30 bg-accent-secondary/5 rounded-full">
                      {post.category}
                    </Badge>
                    <h4 className="text-sm sm:text-base font-black uppercase leading-tight tracking-tight group-hover:text-accent-secondary transition-colors">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-3 text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
                      <Clock size={10} />
                      <span>{post.readingTime} {t.readingTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
