"use client";

import { useState, useCallback } from "react";
import { useCategories } from "@/hooks/useCategories";
import { useSubcategories } from "@/hooks/useSubcategories";
import { useSizes } from "@/hooks/useSizes";
import { getImageUrl } from "@/utils/imageUtils";
import Loader from "@/components/common/Loader";
import Link from "next/link";
import { swalConfirm, swalToast, swalError } from "@/utils/swal";

export default function CategoryMasterControl() {
  const { categories, isLoading: catLoading, deleteCategory } = useCategories();
  const {
    subcategories,
    isLoading: subLoading,
    deleteSubcategory,
  } = useSubcategories();
  const { sizes, isLoading: sizeLoading, deleteSize } = useSizes();

  // Local loading states for individual deletions (to disable buttons)
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);
  const [deletingSubId, setDeletingSubId] = useState(null);
  const [deletingSizeId, setDeletingSizeId] = useState(null);

  // --- Delete Handlers with proper loading and error handling ---
  const handleDeleteCategory = useCallback(
    async (id) => {
      const confirmed = await swalConfirm(
        "Delete Category?",
        "All associated products, subcategories, and sizes will lose their primary classification. This action is irreversible.",
      );
      if (!confirmed) return;

      setDeletingCategoryId(id);
      try {
        await deleteCategory.mutateAsync(id);
        swalToast("Category Removed", "success");
      } catch (err) {
        const message =
          err.response?.data?.message || "Check if this category is in use.";
        swalError("Delete Failed", message);
      } finally {
        setDeletingCategoryId(null);
      }
    },
    [deleteCategory],
  );

  const handleDeleteSub = useCallback(
    async (id) => {
      const confirmed = await swalConfirm(
        "Delete Subcategory?",
        "All products in this subcategory will be uncategorized.",
      );
      if (!confirmed) return;

      setDeletingSubId(id);
      try {
        await deleteSubcategory.mutateAsync(id);
        swalToast("Sub-category Purged", "success");
      } catch (err) {
        const message =
          err.response?.data?.message || "Could not delete subcategory.";
        swalError("Action Blocked", message);
      } finally {
        setDeletingSubId(null);
      }
    },
    [deleteSubcategory],
  );

  const handleDeleteSize = useCallback(
    async (id) => {
      const confirmed = await swalConfirm(
        "Remove Size Template?",
        "Products using this size will lose that size option.",
      );
      if (!confirmed) return;

      setDeletingSizeId(id);
      try {
        await deleteSize.mutateAsync(id);
        swalToast("Size Template Deleted", "success");
      } catch (err) {
        const message =
          err.response?.data?.message || "Could not delete size template.";
        swalError("Sync Error", message);
      } finally {
        setDeletingSizeId(null);
      }
    },
    [deleteSize],
  );

  // Show global loader while any of the main lists are loading
  if (catLoading || subLoading || sizeLoading) {
    return (
      <div className="p-20">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase mb-2">
            Store Architecture
          </h1>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">
            Categories & Taxonomy Hub
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="bg-zinc-900 dark:bg-white text-white dark:text-black px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
        >
          + Initialize Category
        </Link>
      </div>

      {/* Main Grid: Category Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {categories?.map((cat) => (
          <div
            key={cat._id}
            className="bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col group hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-500 hover:-translate-y-1"
          >
            {/* Banner Section */}
            <div className="relative h-64 overflow-hidden bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
              <img
                src={getImageUrl(cat.image)}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 grayscale-[15%] group-hover:grayscale-0"
                alt={cat.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-8 flex items-end">
                <div className="flex justify-between items-end w-full">
                  <div>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.4em] mb-2 drop-shadow-md">
                      Category
                    </p>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                      {cat.name}
                    </h2>
                    <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest mt-2">
                      Slug: {cat.slug}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/admin/categories/${cat._id}`}
                      className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-3 rounded-2xl hover:bg-white hover:text-black transition-all"
                      title="Edit Category"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </Link>
                    <button
                      onClick={() => handleDeleteCategory(cat._id)}
                      disabled={deletingCategoryId === cat._id}
                      className="bg-rose-500/80 backdrop-blur-md border border-rose-500/20 text-white p-3 rounded-2xl hover:bg-rose-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete Category"
                    >
                      {deletingCategoryId === cat._id ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Inner Content Section */}
            <div className="p-8 space-y-10">
              {/* Subcategories Subsection */}
              <section>
                <div className="flex justify-between items-center mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                  <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">
                    Sub-Categories
                  </h4>
                  <Link
                    href="/admin/subcategories/new"
                    className="text-[9px] font-black text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-2 rounded-xl hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all uppercase tracking-widest"
                  >
                    + ADD NEW
                  </Link>
                </div>
                <div className="flex flex-wrap gap-3">
                  {subcategories
                    ?.filter((sub) => sub.category?._id === cat._id)
                    .map((sub) => (
                      <div
                        key={sub._id}
                        className="group/item flex items-center gap-2 bg-zinc-50 dark:bg-[#111] px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all"
                      >
                        <Link
                          href={`/admin/subcategories/new?category=${cat._id}`}
                          className="text-[10px] font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-widest hover:text-indigo-500 transition-colors"
                        >
                          {sub.name}
                        </Link>
                        <div className="w-px h-3 bg-zinc-300 dark:bg-zinc-700 mx-1"></div>
                        <button
                          onClick={() => handleDeleteSub(sub._id)}
                          disabled={deletingSubId === sub._id}
                          className="text-zinc-400 hover:text-rose-500 transition-colors disabled:opacity-50"
                        >
                          {deletingSubId === sub._id ? (
                            <div className="w-3 h-3 border border-rose-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              strokeWidth="3"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    ))}
                  {subcategories?.filter((sub) => sub.category?._id === cat._id)
                    .length === 0 && (
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 dark:bg-zinc-900/50 px-4 py-2 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800">
                      No Sub-categories
                    </p>
                  )}
                </div>
              </section>

              {/* Sizes Subsection */}
              <section>
                <div className="flex justify-between items-center mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                  <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">
                    Available Sizes
                  </h4>
                  <Link
                    href={`/admin/sizes/new?category=${cat._id}`}
                    className="text-[9px] font-black text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-2 rounded-xl hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all uppercase tracking-widest"
                  >
                    + ADD NEW
                  </Link>
                </div>
                <div className="flex flex-wrap gap-3">
                  {sizes
                    ?.filter((s) => s.category?._id === cat._id)
                    .map((s) => (
                      <div
                        key={s._id}
                        className="group/size flex items-center gap-2 bg-zinc-50 dark:bg-[#111] px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all"
                      >
                        <Link
                          href={`/admin/sizes/${s._id}`}
                          className="text-[10px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest hover:text-indigo-500 transition-colors"
                        >
                          {s.name}
                        </Link>
                        <div className="w-px h-3 bg-zinc-300 dark:bg-zinc-700 mx-1"></div>
                        <button
                          onClick={() => handleDeleteSize(s._id)}
                          disabled={deletingSizeId === s._id}
                          className="text-zinc-400 hover:text-rose-500 transition-colors disabled:opacity-50"
                        >
                          {deletingSizeId === s._id ? (
                            <div className="w-3 h-3 border border-rose-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              strokeWidth="3"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    ))}
                  {sizes?.filter((s) => s.category?._id === cat._id).length ===
                    0 && (
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 dark:bg-zinc-900/50 px-4 py-2 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800">
                      No Sizes Defined
                    </p>
                  )}
                </div>
              </section>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
