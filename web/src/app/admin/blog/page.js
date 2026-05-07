"use client";

import { useState } from "react";
import Link from "next/link";
import { useBlogs } from "@/hooks/useBlogs";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  Filter,
  MoreHorizontal,
  BookOpen,
  Clock,
  BarChart3,
  LayoutGrid,
  List,
} from "lucide-react";
import { getImageUrl } from "@/utils/imageUtils";
import Loader from "@/components/common/Loader";
import { swalConfirm, swalToast } from "@/utils/swal";

export default function AdminBlogDashboard() {
  const { blogs, isLoading, deleteBlog } = useBlogs();
  const [searchQuery, setSearchQuery] = useState("");

  // 🕵️ Filter Logic
  const filteredBlogs = blogs?.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDelete = async (id) => {
    const confirmed = await swalConfirm(
      "Purge Narrative?",
      "This sequence will be permanently removed from the foundry archives.",
    );
    if (confirmed) {
      deleteBlog.mutate(id);
    }
  };

  if (isLoading)
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="space-y-10 pb-20">
      {/* 🚀 Top Command Bar */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter dark:text-white italic leading-none">
            Journal <span className="text-rose-600">Archives</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mt-4">
            Total Sequences: {blogs?.length || 0} • System Active
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-rose-600 transition-colors"
              size={16}
            />
            <input
              type="text"
              placeholder="SEARCH PROTOCOLS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 pl-12 pr-6 py-4 rounded-2xl outline-none text-[10px] font-black uppercase tracking-widest w-64 focus:border-rose-600 transition-all shadow-sm"
            />
          </div>
          <Link
            href="/admin/blog/create"
            className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-xl hover:bg-rose-600 hover:text-white transition-all active:scale-95"
          >
            <Plus size={16} /> New Sequence
          </Link>
        </div>
      </header>

      {/* 📊 Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<BookOpen size={18} />}
          label="Published"
          value={blogs?.filter((b) => b.status === "PUBLISHED").length}
          color="text-emerald-500"
        />
        <StatsCard
          icon={<Clock size={18} />}
          label="Drafts"
          value={blogs?.filter((b) => b.status === "DRAFT").length}
          color="text-amber-500"
        />
        <StatsCard
          icon={<BarChart3 size={18} />}
          label="Total Views"
          value={blogs?.reduce((acc, b) => acc + (b.viewCount || 0), 0)}
          color="text-indigo-500"
        />
        <StatsCard
          icon={<Filter size={18} />}
          label="Categories"
          value={new Set(blogs?.map((b) => b.category)).size}
          color="text-rose-500"
        />
      </div>

      {/* 📁 Content Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredBlogs?.length > 0 ? (
          filteredBlogs.map((post) => (
            <div
              key={post._id}
              className="bg-white dark:bg-zinc-900/30 border border-zinc-100 dark:border-white/5 p-5 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-6 group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-500"
            >
              {/* Image Preview */}
              <div className="w-full md:w-32 h-32 rounded-[1.8rem] overflow-hidden bg-zinc-100 shrink-0 shadow-inner">
                <img
                  src={getImageUrl(post.featuredImage)}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                  alt=""
                />
              </div>

              {/* Core Info */}
              <div className="flex-1 text-center md:text-left space-y-1">
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                  <span className="text-[8px] font-black text-rose-600 bg-rose-600/5 px-3 py-1 rounded-full uppercase tracking-widest border border-rose-600/10">
                    {post.category}
                  </span>
                  <span
                    className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                      post.status === "PUBLISHED"
                        ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/5"
                        : "text-zinc-400 border-zinc-400/20 bg-zinc-400/5"
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight dark:text-white leading-tight">
                  {post.title}
                </h3>
                <div className="flex justify-center md:justify-start items-center gap-4 text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <div className="w-1 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
                  <span>{post.readingTime}</span>
                  <div className="w-1 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
                  <span className="flex items-center gap-1">
                    <Eye size={10} /> {post.viewCount || 0}
                  </span>
                </div>
              </div>

              {/* Management Actions */}
              <div className="flex items-center gap-2 pr-4">
                <Link
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  className="p-4 bg-zinc-50 dark:bg-white/5 rounded-2xl text-zinc-400 hover:text-indigo-500 transition-all"
                >
                  <Eye size={20} />
                </Link>
                <Link
                  href={`/admin/blog/${post._id}`}
                  className="p-4 bg-zinc-50 dark:bg-white/5 rounded-2xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
                >
                  <Edit3 size={20} />
                </Link>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="p-4 bg-zinc-50 dark:bg-white/5 rounded-2xl text-zinc-400 hover:text-rose-600 transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center bg-zinc-50 dark:bg-zinc-900/20 rounded-[3rem] border border-dashed border-zinc-200 dark:border-zinc-800">
            <p className="text-xs font-black uppercase tracking-[0.4em] text-zinc-400">
              Zero Narrative Sequences Found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// 📊 Stats Sub-component
function StatsCard({ icon, label, value, color }) {
  return (
    <div className="bg-white dark:bg-zinc-900/40 p-6 rounded-[2rem] border border-zinc-100 dark:border-white/5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">
            {label}
          </p>
          <h4 className="text-2xl font-black tracking-tighter dark:text-white mt-0.5">
            {value}
          </h4>
        </div>
      </div>
    </div>
  );
}
