import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/utils/imageUtils";
import { Calendar, User, Clock, ArrowLeft, CheckCircle, Activity, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function BlogDetails({ blog }) {
  if (!blog) return null;

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="max-w-screen-xl mx-auto px-6 relative">
        {/* 🔙 Back Navigation */}
        <div className="pt-24 sm:pt-32">
          <Link
            href="/blog"
            className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-rose-600 transition-colors group"
          >
            <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-1" />
            Back to Journal
          </Link>
        </div>

        <article>
          {/* 📰 Blog Header */}
          <header className="pt-16 pb-20 text-center space-y-10">
            <div className="space-y-6">
              <Badge variant="outline" className="rounded-full px-6 py-1.5 border-rose-500/30 text-rose-500 font-black text-[10px] uppercase tracking-[0.2em] bg-rose-500/5">
                {blog.category}
              </Badge>
              
              <h1 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-[0.9] text-foreground">
                {blog.title}
              </h1>

              <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground pt-4">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-rose-500" />
                  <span>{blog.author?.name || "Vanguard Team"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span>{blog.readingTime || "5 MIN READ"}</span>
                </div>
              </div>
            </div>
          </header>

          {/* 🖼️ Featured Image */}
          <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-[2rem] overflow-hidden mb-24 shadow-2xl shadow-black/20 group">
            <Image
              src={getImageUrl(blog.featuredImage)}
              alt={blog.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          </div>

          {/* 📝 Main Content */}
          <div className="max-w-3xl mx-auto">
            <div 
              className="prose prose-invert prose-lg max-w-none 
                prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter
                prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-lg
                prose-strong:text-foreground prose-strong:font-black
                prose-blockquote:border-l-rose-500 prose-blockquote:bg-rose-500/5 prose-blockquote:rounded-2xl prose-blockquote:p-8 prose-blockquote:italic prose-blockquote:text-2xl prose-blockquote:font-bold
                prose-img:rounded-[2rem] prose-img:shadow-2xl
                prose-a:text-rose-500 prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* 🔚 Footer Info */}
            <Separator className="my-20 bg-border/10" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-accent relative border-2 border-border/10">
                  <Image
                    src={getImageUrl(blog.author?.avatar)}
                    alt={blog.author?.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-1">Written By</p>
                  <p className="text-xl font-black uppercase italic">{blog.author?.name}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-end">
                {typeof blog.tags === 'string' ? blog.tags.split(',').map((tag) => (
                  <Badge key={tag} variant="secondary" className="rounded-full px-4 py-1 font-bold text-[9px] uppercase tracking-widest bg-accent/50 hover:bg-accent transition-colors cursor-default">
                    #{tag.trim()}
                  </Badge>
                )) : Array.isArray(blog.tags) ? blog.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="rounded-full px-4 py-1 font-bold text-[9px] uppercase tracking-widest bg-accent/50 hover:bg-accent transition-colors cursor-default">
                    #{tag}
                  </Badge>
                )) : null}
              </div>
            </div>

            {/* 🔒 Integrity Footer */}
            {/* <div className="mt-32 p-8 rounded-[2rem] border border-border/10 bg-accent/5 flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-foreground flex items-center justify-center text-background">
                   <Shield size={20} />
                 </div>
                 <div>
                   <p className="text-[11px] font-black uppercase tracking-widest">Verified Content</p>
                   <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Vanguard Integrity Protocol v2.4</p>
                 </div>
               </div>
               <div className="flex items-center gap-2 text-rose-500 font-black text-[10px] uppercase tracking-widest">
                 <Activity size={14} className="animate-pulse" />
                 Secured Session
               </div>
            </div> */}
          </div>
        </article>
      </div>
    </div>
  );
}
