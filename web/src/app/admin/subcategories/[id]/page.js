'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useSubcategories } from '@/hooks/useSubcategories';
import { useCategories } from '@/hooks/useCategories';
import FormInput from '@/components/admin/FormInput';
import FormSelect from '@/components/admin/FormSelect';
import Loader from '@/components/common/Loader';
import Link from 'next/link';
import { swalToast, swalError } from '@/utils/swal';

export default function SubcategoryForm() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetCategory = searchParams.get('category'); // 👈 get category from URL

  const isEdit = id !== 'new';

  const { subcategories, createSubcategory, updateSubcategory } = useSubcategories();
  const { categories } = useCategories();
  const [loading, setLoading] = useState(isEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Initialize form for edit mode OR set default category for new
  useEffect(() => {
    const initialize = async () => {
      if (isEdit && subcategories) {
        const sub = subcategories.find((s) => s._id === id);
        if (sub) {
          setValue('name', sub.name);
          setValue('slug', sub.slug);
          setValue('category', sub.category._id || sub.category);
          setValue('description', sub.description || '');
          setLoading(false);
        } else if (subcategories) {
          setLoading(false);
        }
      } else {
        // New mode: pre‑fill category from URL if present and categories loaded
        if (presetCategory && categories && categories.length > 0) {
          setValue('category', presetCategory);
        }
        setLoading(false);
      }
    };

    initialize();
  }, [isEdit, id, subcategories, categories, presetCategory, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (isEdit) {
        await updateSubcategory.mutateAsync({ id, data });
        swalToast('Architecture Synchronized', 'success');
      } else {
        await createSubcategory.mutateAsync(data);
        swalToast('Sub-category Initialized', 'success');
      }
      setTimeout(() => router.push('/admin/categories'), 1500);
    } catch (err) {
      swalError('Sync Failed', err.response?.data?.message || 'Error processing request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-20"><Loader /></div>;

  const categoryOptions = categories?.map((cat) => ({
    value: cat._id,
    label: cat.name,
  }));

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase mb-2">
            {isEdit ? 'Refine Sub-Category' : 'New Sub-Category'}
          </h1>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Taxonomy Configuration Protocol</p>
        </div>
        <Link
          href="/admin/categories"
          className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          ← Abort & Return
        </Link>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8 md:p-12 shadow-sm space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Category Selection (pre‑filled) */}
          <div className="md:col-span-2 lg:col-span-1">
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">
              Parent Department *
            </label>
            <FormSelect
              name="category"
              register={register}
              errors={errors}
              options={categoryOptions}
              required
              placeholder="Assign to Department"
              className="w-full bg-zinc-50 dark:bg-[#111] border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 outline-none font-bold focus:border-zinc-900 dark:focus:border-white transition-all"
            />
          </div>
          <div className="hidden lg:block"></div>

          {/* Name Input */}
          <div>
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">
              Sub-category Name *
            </label>
            <FormInput
              name="name"
              register={register}
              errors={errors}
              required
              placeholder="e.g. Graphic Tees"
              className="w-full bg-zinc-50 dark:bg-[#111] border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 outline-none font-bold focus:border-zinc-900 dark:focus:border-white transition-all"
            />
          </div>

          {/* Slug Input */}
          <div>
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">
              URL Extension *
            </label>
            <FormInput
              name="slug"
              register={register}
              errors={errors}
              required
              placeholder="graphic-tees"
              pattern={/^[a-z0-9-]+$/}
              className="w-full bg-zinc-50 dark:bg-[#111] border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 outline-none font-bold focus:border-zinc-900 dark:focus:border-white transition-all"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">
            Internal Narrative
          </label>
          <textarea
            {...register('description')}
            rows="4"
            className="w-full bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-[2rem] px-6 py-5 outline-none font-medium text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-white transition-all resize-none shadow-inner"
            placeholder="Describe the aesthetic scope of this sub-category..."
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-zinc-100 dark:border-zinc-800 mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-[2] bg-zinc-900 dark:bg-white text-white dark:text-black py-5 rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:scale-105 active:scale-95 transition-all shadow-2xl disabled:opacity-50"
          >
            {isSubmitting ? 'Processing Protocol...' : isEdit ? 'Update Architecture' : 'Initialize Protocol'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/categories')}
            className="flex-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 py-5 rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:text-zinc-900 dark:hover:text-white transition-colors border border-zinc-200 dark:border-zinc-800"
          >
            Discard
          </button>
        </div>
      </form>
    </div>
  );
}