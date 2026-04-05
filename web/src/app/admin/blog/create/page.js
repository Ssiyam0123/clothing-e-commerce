// src/app/admin/blog/create/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBlogs } from '@/hooks/useBlogs';
import RichTextEditor from '@/components/admin/RichTextEditor'; // Use the upgraded editor
import { ShieldCheck, ArrowLeft, Globe, ImageIcon, Loader2 } from 'lucide-react';
import { swalError, swalToast } from '@/utils/swal'; // ✅ Import missing swal utilities

export default function CreateBlog() {
  const router = useRouter();
  const { createBlog } = useBlogs(); // ✅ Expects mutateAsync or mutate? We'll use mutateAsync for better control

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'LIFESTYLE',
    status: 'PUBLISHED',
    seo: { metaTitle: '', metaDescription: '' },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      return swalError('Visual Missing', 'Please select a featured image.');
    }
    if (!formData.title.trim()) {
      return swalError('Missing Title', 'The narrative needs a title.');
    }
    if (!formData.content.trim()) {
      return swalError('Empty Content', 'Please write something before publishing.');
    }

    setIsSubmitting(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('category', formData.category);
    data.append('status', formData.status);
    data.append('seo', JSON.stringify(formData.seo));
    data.append('image', imageFile); // Matches backend upload.single('image')

    try {
      await createBlog.mutateAsync(data); // ✅ Use mutateAsync to catch errors easily
      swalToast('Narrative deployed successfully!', 'success');
      router.push('/admin/blog'); // Redirect to blog list
    } catch (err) {
      const message = err.response?.data?.message || 'Deployment failed. Check your inputs.';
      swalError('Publication Failed', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <header className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-full hover:scale-110 transition-all"
        >
          <ArrowLeft size={20} className="dark:text-white" />
        </button>
        <h1 className="text-5xl font-black uppercase tracking-tighter dark:text-white italic">
          Initialize Narrative
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-10">
        {/* Editor Main */}
        <div className="lg:col-span-8 space-y-8">
          <input
            type="text"
            placeholder="SEQUENCE TITLE"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-transparent text-5xl font-black uppercase tracking-tighter outline-none dark:text-white border-b-4 border-zinc-100 dark:border-zinc-900 pb-4 focus:border-rose-600 transition-all"
          />
          <div className="bg-white dark:bg-zinc-900 rounded-[3rem] overflow-hidden border dark:border-white/5 shadow-inner">
            <RichTextEditor
              value={formData.content}
              onChange={(val) => setFormData({ ...formData, content: val })}
            />
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-8">
          {/* Featured Image Upload */}
          <section className="bg-zinc-50 dark:bg-zinc-900/50 p-8 rounded-[3rem] border dark:border-white/5 space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">
                Visual Asset (Cloudinary)
              </label>
              <div className="relative group aspect-video rounded-3xl overflow-hidden bg-white dark:bg-zinc-800 border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center cursor-pointer">
                {imagePreview ? (
                  <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <div className="text-center p-6">
                    <ImageIcon className="mx-auto mb-2 text-zinc-400" size={32} />
                    <p className="text-[9px] font-black text-zinc-500 uppercase">
                      Click to Select Artifact
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              {imagePreview && (
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="text-xs text-rose-500 mt-2 hover:underline"
                >
                  Remove image
                </button>
              )}
            </div>

            {/* Category Selection */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">
                Classification
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-white dark:bg-zinc-800 p-4 rounded-2xl outline-none text-xs font-bold"
              >
                {['LIFESTYLE', 'COLLECTION', 'FABRIC', 'CULTURE', 'NEWS'].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Toggle (Optional) */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">
                Status
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="PUBLISHED"
                    checked={formData.status === 'PUBLISHED'}
                    onChange={() => setFormData({ ...formData, status: 'PUBLISHED' })}
                    className="accent-rose-600"
                  />
                  <span className="text-xs font-bold">Publish now</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="DRAFT"
                    checked={formData.status === 'DRAFT'}
                    onChange={() => setFormData({ ...formData, status: 'DRAFT' })}
                    className="accent-zinc-500"
                  />
                  <span className="text-xs font-bold">Save as Draft</span>
                </label>
              </div>
            </div>
          </section>

          {/* SEO Module */}
          <section className="bg-zinc-900 text-white p-8 rounded-[3rem] space-y-6 shadow-2xl">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-500 flex items-center gap-2">
              <Globe size={14} /> Neural SEO
            </h3>
            <input
              type="text"
              placeholder="META TITLE"
              value={formData.seo.metaTitle}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  seo: { ...formData.seo, metaTitle: e.target.value },
                })
              }
              className="w-full bg-white/5 p-4 rounded-xl outline-none text-[10px] uppercase font-black border border-white/5"
            />
            <textarea
              placeholder="META DESCRIPTION"
              rows="3"
              value={formData.seo.metaDescription}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  seo: { ...formData.seo, metaDescription: e.target.value },
                })
              }
              className="w-full bg-white/5 p-4 rounded-xl outline-none text-xs border border-white/5"
            />
          </section>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-rose-600 text-white py-8 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-xs shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-70"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <ShieldCheck size={20} /> Authorize Sequence
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}