'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { getImageUrl } from '@/utils/imageUtils';
import Loader from '@/components/common/Loader';

export default function BlogMagazinePage() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => (await api.get('/blogs')).data
  });

  if (isLoading) return <Loader />;

  const featured = posts?.[0];
  const remaining = posts?.slice(1);

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] pt-32 pb-20 px-6">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header Section */}
        <header className="mb-20 text-center">
          <h1 className="text-7xl md:text-9xl font-black uppercase italic tracking-tighter dark:text-white leading-none">
            Foundry<br/><span className="text-rose-600">Journal</span>
          </h1>
          <p className="mt-6 text-[10px] font-black uppercase tracking-[0.6em] text-zinc-400">Tactical Aesthetic & Fabric Narrative</p>
        </header>

        {/* 🏆 Magazine Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Feature (Left 7 Columns) */}
          {featured && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-8 group cursor-pointer"
            >
              <Link href={`/blog/${featured.slug}`}>
                <div className="relative aspect-[16/9] overflow-hidden rounded-[3rem] bg-zinc-100 dark:bg-zinc-900">
                  <img src={getImageUrl(featured.featuredImage)} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" />
                  <div className="absolute top-8 left-8 bg-white dark:bg-black px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest">{featured.category}</div>
                </div>
                <div className="mt-8 space-y-4">
                  <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter dark:text-white group-hover:text-rose-600 transition-colors">{featured.title}</h2>
                  <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    <span>{featured.author?.name}</span>
                    <div className="w-1 h-1 bg-zinc-300 rounded-full" />
                    <span>{featured.readingTime}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Sidebar Sequence (Right 4 Columns) */}
          <div className="lg:col-span-4 space-y-12">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-400 border-b dark:border-zinc-800 pb-4">Latest Sequence</h3>
            {remaining?.map((post, idx) => (
              <Link href={`/blog/${post.slug}`} key={idx} className="flex gap-6 group">
                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-zinc-100">
                  <img src={getImageUrl(post.featuredImage)} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                </div>
                <div className="space-y-2">
                  <span className="text-[8px] font-black text-rose-600 uppercase tracking-widest">{post.category}</span>
                  <h4 className="text-sm font-black uppercase leading-tight dark:text-white group-hover:underline">{post.title}</h4>
                  <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{post.readingTime}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}