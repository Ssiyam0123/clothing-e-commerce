"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/utils/imageUtils";
import { Calendar, User, Clock, ArrowLeft, Share2, Bookmark, CheckCircle, Activity, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { motion, useScroll, useSpring } from "framer-motion";

export default function BlogDetailsClient({ blog }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-background transition-colors duration-700 pb-24 sm:pb-32 selection:bg-rose-500/30 selection:text-rose-500">
      {/* 📡 Reading Progress Intel */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-rose-600 origin-left z-[110]"
        style={{ scaleX }}
      />

      {/* 🏔️ Narrative Hero Section - Pure Immersion */}
      <div className="relative w-full h-[65vh] sm:h-[70vh] md:h-[85vh] overflow-hidden group">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={getImageUrl(blog.featuredImage, 1920, 85)}
            alt={blog.title}
            fill
            priority
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            sizes="100vw"
          />
        </motion.div>
        
        {/* Layered Gradient Matrix */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12 lg:p-24">
          <div className="max-w-[1400px] mx-auto w-full space-y-6 sm:space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-4"
            >
              <Badge className="bg-rose-600 text-white border-none px-6 py-2 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_10px_30px_rgba(225,29,72,0.3)]">
                {blog.category}
              </Badge>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-4xl sm:text-7xl lg:text-8xl xl:text-9xl font-black uppercase tracking-tighter leading-[0.85] italic text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] max-w-6xl"
            >
              {blog.title}
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex flex-wrap items-center gap-3 sm:gap-10 text-[9px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-white"
            >
              <div className="flex items-center gap-3 bg-white/10 sm:bg-white/5 backdrop-blur-xl sm:backdrop-blur-md border border-white/20 sm:border-white/10 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl">
                <User size={12} className="text-rose-500" />
                <span>{blog.author?.name || "Vanguard"}</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 sm:bg-white/5 backdrop-blur-xl sm:backdrop-blur-md border border-white/20 sm:border-white/10 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl">
                <Calendar size={12} className="text-rose-500" />
                <span>{new Date(blog.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 sm:bg-white/5 backdrop-blur-xl sm:backdrop-blur-md border border-white/20 sm:border-white/10 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl">
                <Clock size={12} className="text-rose-500" />
                <span>{blog.readingTime}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 📖 Content Narrative Section */}
      <div className="max-w-[1400px] mx-auto px-6 grid lg:grid-cols-12 gap-12 sm:gap-24 mt-12 sm:mt-32">
        {/* 🖱️ Interactive Sidebar */}
        <aside className="lg:col-span-3 space-y-12 order-2 lg:order-2">
           <div className="sticky top-32 space-y-12">
              <section className="space-y-6">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground flex items-center gap-3">
                   <Activity size={12} className="text-rose-600" /> Personnel_File
                 </h4>
                 <div className="p-8 rounded-[2.5rem] bg-card border border-border/10 shadow-2xl space-y-6 relative overflow-hidden group/author">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/5 blur-[50px] -mr-16 -mt-16" />
                    
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-foreground flex items-center justify-center text-background font-black text-xl sm:text-2xl shadow-xl relative z-10">
                       {blog.author?.name?.[0] || "V"}
                    </div>
                    <div className="space-y-2 relative z-10">
                       <p className="text-base font-black uppercase tracking-tight italic flex items-center gap-2">
                         {blog.author?.name || "Vanguard Editor"}
                         <CheckCircle size={14} className="text-rose-600" />
                       </p>
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Field Intelligence</p>
                    </div>
                 </div>
              </section>

              <section className="flex flex-col gap-4">
                 <Button variant="outline" className="rounded-2xl h-16 border-border/10 hover:border-rose-600/50 hover:bg-rose-600/5 hover:text-rose-600 transition-all uppercase font-black text-[10px] tracking-[0.3em] gap-4 group">
                    <Bookmark size={18} className="group-hover:fill-current" />
                    Archive Protocol
                 </Button>
                 <Button 
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: blog.title, url: window.location.href });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                      }
                    }}
                    className="rounded-2xl h-16 bg-foreground text-background hover:bg-rose-600 hover:text-white transition-all uppercase font-black text-[10px] tracking-[0.3em] gap-4 shadow-2xl"
                 >
                    <Share2 size={18} />
                    Deploy Link
                 </Button>
              </section>
           </div>
        </aside>

        {/* 📑 Primary Intel Body */}
        <article className="lg:col-span-9 space-y-16 order-1 lg:order-1">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className={cn(
              "prose prose-sm sm:prose-lg md:prose-xl max-w-none dark:prose-invert",
              "prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-headings:italic prose-headings:text-foreground",
              "prose-p:leading-[1.8] prose-p:text-foreground/90 sm:prose-p:text-muted-foreground/90 prose-p:font-medium prose-p:mb-8",
              "prose-img:rounded-[2.5rem] prose-img:shadow-2xl prose-img:my-10 sm:prose-img:my-16",
              "prose-a:text-rose-600 prose-a:font-black prose-a:no-underline hover:prose-a:underline",
              "prose-blockquote:border-l-4 prose-blockquote:border-rose-600 prose-blockquote:bg-rose-500/5 prose-blockquote:p-8 prose-blockquote:rounded-r-3xl prose-blockquote:italic prose-blockquote:font-black",
              "prose-ul:space-y-4 prose-li:font-bold prose-li:text-foreground/80"
            )}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          <Separator className="bg-border/10" />

          <footer className="flex flex-col sm:flex-row justify-between items-center gap-10">
            <Link
              href="/blog"
              className="group flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground hover:text-rose-600 transition-all"
            >
              <div className="w-14 h-14 rounded-full border border-border/10 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white group-hover:-translate-x-3 transition-all duration-500 shadow-lg">
                 <ArrowLeft size={20} />
              </div>
              Back to Nexus
            </Link>
            
            <div className="flex items-center gap-4 bg-card/50 px-8 py-4 rounded-full border border-border/10">
               <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">ID: {blog._id?.slice(-8).toUpperCase()}</span>
               <div className="w-px h-6 bg-border/20" />
               <Badge variant="outline" className="text-[9px] uppercase tracking-[0.2em] border-rose-600/30 text-rose-600 bg-rose-600/5 font-black">ACTIVE</Badge>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}
