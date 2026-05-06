'use client';

import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/utils/imageUtils';
import { Calendar, User, Clock, ArrowLeft, Share2 } from 'lucide-react';

export default function BlogDetailsClient({ blog }) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] transition-colors duration-700">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] md:h-[70vh] bg-zinc-900 overflow-hidden">
        <Image
          src={getImageUrl(blog.featuredImage, 1920, 85)}
          alt={blog.title}
          fill
          priority
          className="object-cover opacity-70"
          sizes="100vw"
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
                <User size={16} aria-hidden="true" />
                <span>{blog.author?.name || 'Vanguard'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} aria-hidden="true" />
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} aria-hidden="true" />
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
            aria-label="Back to blog listing"
          >
            <ArrowLeft size={18} aria-hidden="true" /> Back to Journal
          </Link>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: blog.title,
                  url: window.location.href,
                }).catch(err => {
                  console.error('Error sharing:', err);
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }
            }}
            className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all"
            aria-label="Share this article"
          >
            <Share2 size={14} aria-hidden="true" /> Share Article
          </button>
        </div>
      </article>
    </div>
  );
}
