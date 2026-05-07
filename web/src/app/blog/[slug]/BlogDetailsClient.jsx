"use client";

import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/utils/imageUtils";
import { Calendar, User, Clock, ArrowLeft, Share2, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function BlogDetailsClient({ blog }) {
  return (
    <div className="min-h-screen bg-background transition-colors duration-700 pb-24 sm:pb-32">
      {/* 🏔️ Narrative Hero Section */}
      <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[75vh] overflow-hidden">
        <Image
          src={getImageUrl(blog.featuredImage, 1920, 85)}
          alt={blog.title}
          fill
          priority
          className="object-cover opacity-80"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12 lg:p-20">
          <div className="max-w-[1400px] mx-auto w-full space-y-6 sm:space-y-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Badge className="bg-accent-secondary text-white border-none px-4 py-1.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-2xl">
                {blog.category}
              </Badge>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-7xl lg:text-8xl xl:text-9xl font-black uppercase tracking-tighter leading-[0.9] italic text-gradient max-w-5xl"
            >
              {blog.title}
            </motion.h1>

            <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-foreground/70">
              <div className="flex items-center gap-3 glass px-4 py-2 rounded-2xl">
                <User size={14} className="text-accent-secondary" />
                <span>{blog.author?.name || "Vanguard"}</span>
              </div>
              <div className="flex items-center gap-3 glass px-4 py-2 rounded-2xl">
                <Calendar size={14} className="text-accent-secondary" />
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3 glass px-4 py-2 rounded-2xl">
                <Clock size={14} className="text-accent-secondary" />
                <span>{blog.readingTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📖 Content Narrative Section */}
      <div className="max-w-[1400px] mx-auto px-6 grid lg:grid-cols-12 gap-12 sm:gap-20 mt-12 sm:mt-20">
        <aside className="lg:col-span-3 space-y-10 order-2 lg:order-1">
           <div className="sticky top-32 space-y-10">
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">The_Author</h4>
                 <div className="p-6 rounded-[2rem] bg-accent/10 border border-border/5 space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-foreground flex items-center justify-center text-background font-black text-xl">
                       {blog.author?.name?.[0] || "V"}
                    </div>
                    <div className="space-y-1">
                       <p className="text-sm font-black uppercase">{blog.author?.name || "Vanguard Editor"}</p>
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Field Operative</p>
                    </div>
                 </div>
              </div>

              <div className="flex flex-col gap-4">
                 <Button variant="outline" className="rounded-2xl h-14 border-border/10 hover:bg-accent-secondary hover:text-white transition-all uppercase font-black text-[10px] tracking-widest gap-3">
                    <Bookmark size={16} />
                    Save Protocol
                 </Button>
                 <Button 
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: blog.title, url: window.location.href });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                      }
                    }}
                    className="rounded-2xl h-14 bg-foreground text-background hover:bg-accent-secondary hover:text-white transition-all uppercase font-black text-[10px] tracking-widest gap-3"
                 >
                    <Share2 size={16} />
                    Distribute Link
                 </Button>
              </div>
           </div>
        </aside>

        <article className="lg:col-span-9 space-y-12 order-1 lg:order-2">
          <div
            className="prose prose-sm sm:prose-lg md:prose-xl dark:prose-invert prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-a:text-accent-secondary prose-strong:text-foreground prose-img:rounded-[2rem] max-w-none prose-p:leading-relaxed prose-p:text-muted-foreground/90 prose-p:font-medium"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          <Separator className="bg-border/10" />

          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <Link
              href="/blog"
              className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-accent-secondary transition-all"
            >
              <div className="w-10 h-10 rounded-full border border-border/10 flex items-center justify-center group-hover:-translate-x-2 transition-transform">
                 <ArrowLeft size={16} />
              </div>
              Abort To Journal
            </Link>
            
            <div className="flex items-center gap-4">
               <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Secure Transfer</span>
               <div className="w-12 h-px bg-border/20" />
               <Badge variant="outline" className="text-[8px] uppercase tracking-widest border-border/10">v4.0.1</Badge>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
