"use client";

import { useState, useCallback } from "react";
import { useAdminCategories } from "@/hooks/admin/useAdminCategories";
import { useSubcategories } from "@/hooks/useSubcategories";
import { useSizes } from "@/hooks/useSizes";
import { getImageUrl } from "@/utils/imageUtils";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { swalConfirm, swalToast, swalError } from "@/utils/swal";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Layers, Maximize2, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CategoryMasterControl() {
  const { categories, isLoading: catLoading, deleteCategory } = useAdminCategories();
  const {
    subcategories,
    isLoading: subLoading,
    deleteSubcategory,
  } = useSubcategories();
  const { sizes, isLoading: sizeLoading, deleteSize } = useSizes();

  const [deletingCategoryId, setDeletingCategoryId] = useState(null);
  const [deletingSubId, setDeletingSubId] = useState(null);
  const [deletingSizeId, setDeletingSizeId] = useState(null);

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
        swalError("Delete Failed", err.response?.data?.message || "Check if this category is in use.");
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
        swalError("Action Blocked", err.response?.data?.message || "Could not delete subcategory.");
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
        swalError("Sync Error", err.response?.data?.message || "Could not delete size template.");
      } finally {
        setDeletingSizeId(null);
      }
    },
    [deleteSize],
  );

  if (catLoading || subLoading || sizeLoading) {
    return (
      <div className="admin-page-container">
        <div className="admin-section-header">
          <div className="space-y-2">
            <Skeleton className="h-10 w-[200px] md:w-[300px] rounded-xl" />
            <Skeleton className="h-4 w-32 md:w-48" />
          </div>
          <Skeleton className="h-12 md:h-14 w-full md:w-56 rounded-full" />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="min-h-[400px] md:min-h-[600px] rounded-[3rem]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-section-header">
        <div>
          <h1 className="admin-title">
            Architecture
          </h1>
          <p className="admin-subtitle">
            Taxonomy & Store Hierarchy
          </p>
        </div>
        <Link href="/admin/categories/new" className="w-full md:w-auto">
          <Button className="bg-foreground text-background hover:bg-primary hover:text-primary-foreground h-12 md:h-14 px-8 md:px-10 rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95 w-full">
            <Plus className="mr-2" size={16} /> Initialize Category
          </Button>
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {categories?.map((cat) => (
          <Card
            key={cat._id}
            className="group overflow-hidden rounded-[3rem] border-border bg-card shadow-2xl hover:border-primary/50 transition-all duration-700 hover:-translate-y-2"
          >
            {/* Banner */}
            <div className="relative h-72 overflow-hidden bg-muted">
              <img
                src={getImageUrl(cat.image)}
                className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                alt={cat.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent p-10 flex flex-col justify-end">
                <div className="flex justify-between items-end gap-4">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-white/60 uppercase tracking-[0.5em] drop-shadow-md mb-2">
                      Department Artifact
                    </p>
                    <h2 className="text-4xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-none italic drop-shadow-2xl">
                      {cat.name}
                    </h2>
                    <div className="flex items-center gap-3 mt-3">
                      <Badge variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 text-white font-black text-[8px] px-3 py-1 uppercase tracking-widest">
                        Slug: {cat.slug}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link href={`/admin/categories/${cat._id}`}>
                      <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white hover:text-black transition-all">
                        <Edit2 size={18} />
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="icon"
                      disabled={deletingCategoryId === cat._id}
                      onClick={() => handleDeleteCategory(cat._id)}
                      className="h-12 w-12 rounded-2xl shadow-xl shadow-rose-500/20"
                    >
                      {deletingCategoryId === cat._id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Panels */}
            <CardContent className="p-10 space-y-12">
              {/* Subcategories */}
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-border pb-4">
                  <div className="flex items-center gap-2">
                    <Layers className="text-muted-foreground" size={14} />
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
                      Sub-Departments
                    </h4>
                  </div>
                  <Link href={`/admin/subcategories/new?category=${cat._id}`}>
                    <Button variant="ghost" className="h-8 px-4 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground">
                      <Plus size={12} className="mr-1" /> New Entry
                    </Button>
                  </Link>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {subcategories?.filter((sub) => sub.category?._id === cat._id || sub.category === cat._id).map((sub) => (
                    <div
                      key={sub._id}
                      className="group/item flex items-center gap-3 bg-muted/30 px-4 py-2.5 rounded-2xl border border-border hover:border-primary/40 transition-all shadow-sm"
                    >
                      <Link
                        href={`/admin/subcategories/${sub._id}`}
                        className="text-[10px] font-black text-foreground/80 uppercase tracking-widest hover:text-primary transition-colors"
                      >
                        {sub.name}
                      </Link>
                      <div className="w-px h-3 bg-border"></div>
                      <button
                        onClick={() => handleDeleteSub(sub._id)}
                        disabled={deletingSubId === sub._id}
                        className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                      >
                        {deletingSubId === sub._id ? (
                          <div className="w-3 h-3 border border-destructive border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <X size={12} strokeWidth={3} />
                        )}
                      </button>
                    </div>
                  ))}
                  {subcategories?.filter((sub) => sub.category?._id === cat._id || sub.category === cat._id).length === 0 && (
                    <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] py-4 w-full text-center border-2 border-dashed border-border rounded-3xl">
                      Manifest Empty
                    </p>
                  )}
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-border pb-4">
                  <div className="flex items-center gap-2">
                    <Maximize2 className="text-muted-foreground" size={14} />
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
                      Dimensional Matrix
                    </h4>
                  </div>
                  <Link href={`/admin/sizes/new?category=${cat._id}`}>
                    <Button variant="ghost" className="h-8 px-4 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground">
                      <Plus size={12} className="mr-1" /> New Entry
                    </Button>
                  </Link>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {sizes?.filter((s) => s.category?._id === cat._id || s.category === cat._id).map((s) => (
                    <div
                      key={s._id}
                      className="group/size flex items-center gap-3 bg-muted/30 px-4 py-2.5 rounded-2xl border border-border hover:border-primary/40 transition-all shadow-sm"
                    >
                      <Link
                        href={`/admin/sizes/${s._id}`}
                        className="text-[10px] font-black text-foreground/80 uppercase tracking-widest hover:text-primary transition-colors"
                      >
                        {s.name}
                      </Link>
                      <div className="w-px h-3 bg-border"></div>
                      <button
                        onClick={() => handleDeleteSize(s._id)}
                        disabled={deletingSizeId === s._id}
                        className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                      >
                        {deletingSizeId === s._id ? (
                          <div className="w-3 h-3 border border-destructive border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <X size={12} strokeWidth={3} />
                        )}
                      </button>
                    </div>
                  ))}
                  {sizes?.filter((s) => s.category?._id === cat._id || s.category === cat._id).length === 0 && (
                    <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] py-4 w-full text-center border-2 border-dashed border-border rounded-3xl">
                      Manifest Empty
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

const X = ({ size = 12, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);
