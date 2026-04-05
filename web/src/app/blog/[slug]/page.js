// src/app/blog/[slug]/page.js
'use client';

import { useParams } from 'next/navigation';
import { useBlogs } from '@/hooks/useBlogs';
import Loader from '@/components/common/Loader';
import { getImageUrl } from '@/utils/imageUtils';
import Link from 'next/link';
import { Calendar, User, Clock, ArrowLeft, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SingleBlogPage() {
  const { slug } = useParams();
  const { blog, blogLoading } = useBlogs(slug);

  if (blogLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#050505]">
        <Loader />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#050505] px-6 text-center">
        <h1 className="text-6xl font-black text-zinc-900 dark:text-white mb-4">404</h1>
        <p className="text-zinc-500 mb-8">The narrative you're looking for doesn't exist.</p>
        <Link
          href="/blog"
          className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-black text-sm uppercase tracking-wider hover:scale-105 transition-all"
        >
          Back to Journal
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] transition-colors duration-700">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] md:h-[70vh] bg-zinc-900 overflow-hidden">
        <img
          src={getImageUrl(blog.featuredImage)}
          alt={blog.title}
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1.5 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-6">
              {blog.category}
            </span>
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-tight mb-6">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-300">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{blog.author?.name || 'Vanguard'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{blog.readingTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <article className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div
          className="prose prose-lg dark:prose-invert prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-a:text-rose-600 prose-strong:text-rose-600 max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Share & Back */}
        <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap justify-between items-center gap-4">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-rose-600 transition-colors"
          >
            <ArrowLeft size={18} /> Back to Journal
          </Link>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: blog.title,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }
            }}
            className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all"
          >
            <Share2 size={14} /> Share Article
          </button>
        </div>
      </article>
    </div>
  );
}