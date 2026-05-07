"use client";

import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/utils/imageUtils";

export default function BlogMagazineClient({ posts }) {
  const featured = posts?.[0];
  const remaining = posts?.slice(1);

  return (
    <div className="min-h-screen bg-surface dark:bg-[#050505] pt-32 pb-20 px-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Header Section */}
        <header className="mb-20 text-center">
          <h1 className="text-7xl md:text-9xl font-black uppercase italic tracking-tighter  leading-none">
            Foundry
            <br />
            <span className="text-rose-600">Journal</span>
          </h1>
          <p className="mt-6 text-[10px] font-black uppercase tracking-[0.6em] text-muted">
            Tactical Aesthetic & Fabric Narrative
          </p>
        </header>

        {/* Magazine Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Feature */}
          {featured && (
            <div className="lg:col-span-8 group cursor-pointer">
              <Link
                href={`/blog/${featured.slug}`}
                aria-label={`Read full article: ${featured.title}`}
              >
                <div className="relative aspect-[16/9] overflow-hidden rounded-[3rem] bg-elevated dark:bg-accent-primary">
                  <Image
                    src={getImageUrl(featured.featuredImage, 1200, 85)}
                    alt={featured.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute top-8 left-8 bg-surface px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest">
                    {featured.category}
                  </div>
                </div>
                <div className="mt-8 space-y-4">
                  <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter  group-hover:text-rose-600 transition-colors">
                    {featured.title}
                  </h2>
                  <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-muted">
                    <span>{featured.author?.name}</span>
                    <div
                      className="w-1 h-1 bg-zinc-300 rounded-full"
                      aria-hidden="true"
                    />
                    <span>{featured.readingTime}</span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Sidebar – Latest Sequence */}
          <div className="lg:col-span-4 space-y-12">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-muted border-b dark:border-light pb-4">
              Latest Sequence
            </h3>
            {remaining?.map((post) => (
              <Link
                href={`/blog/${post.slug}`}
                key={post._id}
                className="flex gap-6 group"
                aria-label={`Read article: ${post.title}`}
              >
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-elevated">
                  <Image
                    src={getImageUrl(post.featuredImage, 150, 75)}
                    alt={post.title}
                    fill
                    sizes="96px"
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[8px] font-black text-rose-600 uppercase tracking-widest">
                    {post.category}
                  </span>
                  <h4 className="text-sm font-black uppercase leading-tight  group-hover:underline">
                    {post.title}
                  </h4>
                  <p className="text-[9px] font-bold text-muted uppercase tracking-widest">
                    {post.readingTime}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
