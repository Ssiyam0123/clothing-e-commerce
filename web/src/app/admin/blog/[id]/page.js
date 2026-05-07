"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBlogs } from "@/hooks/useBlogs";
import BlogEditor from "@/components/admin/BlogEditor";
import Loader from "@/components/common/Loader";
import { ShieldCheck, ArrowLeft, RefreshCcw } from "lucide-react";

export default function EditBlog() {
  const { id } = useParams();
  const router = useRouter();
  const { blog, isBlogLoading, updateBlog } = useBlogs(id);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "LIFESTYLE",
    featuredImage: "",
    status: "PUBLISHED",
    seo: { metaTitle: "", metaDescription: "" },
  });

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title,
        content: blog.content,
        category: blog.category,
        featuredImage: blog.featuredImage,
        status: blog.status,
        seo: {
          metaTitle: blog.seo?.metaTitle || "",
          metaDescription: blog.seo?.metaDescription || "",
        },
      });
    }
  }, [blog]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBlog.mutate(formData, {
      onSuccess: () => router.push("/admin/blogs"),
    });
  };

  if (isBlogLoading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      <header className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-full"
        >
          <ArrowLeft size={20} className="dark:text-white" />
        </button>
        <h1 className="text-5xl font-black uppercase tracking-tighter dark:text-white italic">
          Reconfigure Sequence
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <input
            type="text"
            value={formData.title}
            required
            className="w-full bg-transparent text-5xl font-black uppercase tracking-tighter outline-none dark:text-white border-b-4 border-zinc-100 dark:border-zinc-900 pb-4 focus:border-rose-600 transition-all"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <div className="bg-white dark:bg-zinc-900 rounded-[3rem] border dark:border-white/5 shadow-inner overflow-hidden">
            <BlogEditor
              value={formData.content}
              onChange={(val) => setFormData({ ...formData, content: val })}
            />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <section className="bg-zinc-50 dark:bg-zinc-900/50 p-8 rounded-[3rem] border dark:border-white/5 space-y-6">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">
              Protocol Stats
            </label>
            <div className="p-4 bg-white dark:bg-zinc-800 rounded-2xl">
              <p className="text-[9px] font-black text-zinc-500 uppercase">
                Total Impressions
              </p>
              <p className="text-2xl font-black dark:text-white">
                {blog?.viewCount || 0}
              </p>
            </div>
            <input
              type="text"
              value={formData.featuredImage}
              className="w-full bg-white dark:bg-zinc-800 p-4 rounded-2xl outline-none text-[10px]"
              onChange={(e) =>
                setFormData({ ...formData, featuredImage: e.target.value })
              }
            />
          </section>

          <button
            type="submit"
            disabled={updateBlog.isPending}
            className="w-full bg-black dark:bg-white text-white dark:text-black py-8 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-xs shadow-2xl hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-4"
          >
            {updateBlog.isPending ? (
              <RefreshCcw className="animate-spin" />
            ) : (
              <>
                <ShieldCheck size={20} /> Update Archive
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
