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
import { Plus, Edit2, Trash2, Layers, Maximize2, Hash, Star } from "lucide-react";
import { cn } from "@/lib/utils";

import { useFilters } from "@/hooks/useFilters";
import Pagination from "@/components/common/Pagination";

export default function CategoryMasterControl() {
  const { page, setPage, queryParams } = useFilters({ initialLimit: 30 });
  const { categories, total, pages, isLoading: catLoading, deleteCategory, toggleFeatured } = useAdminCategories(queryParams);
  const {
    subcategories,
    isLoading: subLoading,
    deleteSubcategory,
  } = useSubcategories();
  const { sizes, isLoading: sizeLoading, deleteSize } = useSizes();

  const [deletingCategoryId, setDeletingCategoryId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [deletingSubId, setDeletingSubId] = useState(null);
  const [deletingSizeId, setDeletingSizeId] = useState(null);

  const handleToggleFeatured = useCallback(
    async (id, currentStatus) => {
      setTogglingId(id);
      try {
        await toggleFeatured({ id, isFeatured: !currentStatus });
        swalToast(currentStatus ? "Removed from featured" : "Category featured", "success");
      } catch (err) {
        swalError("Update Failed", "Could not update featured status.");
      } finally {
        setTogglingId(null);
      }
    },
    [toggleFeatured]
  );

  const handleDeleteCategory = useCallback(
    async (id) => {
      const confirmed = await swalConfirm(
        "Delete Category?",
        "All products and subcategories in this category will be affected. This action cannot be undone.",
      );
      if (!confirmed) return;

      setDeletingCategoryId(id);
      try {
        await deleteCategory(id);
        swalToast("Category deleted", "success");
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
        "All products in this subcategory will be moved to uncategorized.",
      );
      if (!confirmed) return;

      setDeletingSubId(id);
      try {
        await deleteSubcategory(id);
        swalToast("Subcategory deleted", "success");
      } catch (err) {
        swalError("Delete failed", err.response?.data?.message || "Could not delete subcategory.");
      } finally {
        setDeletingSubId(null);
      }
    },
    [deleteSubcategory],
  );

  const handleDeleteSize = useCallback(
    async (id) => {
      const confirmed = await swalConfirm(
        "Delete Size?",
        "Products using this size will lose this option.",
      );
      if (!confirmed) return;

      setDeletingSizeId(id);
      try {
        await deleteSize(id);
        swalToast("Size deleted", "success");
      } catch (err) {
        swalError("Delete failed", err.response?.data?.message || "Could not delete size.");
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
        <div className="grid grid-cols-1 gap-12">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="min-h-[500px] md:min-h-[600px] rounded-[3rem]" />
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
            Categories
          </h1>
          <p className="admin-subtitle">
            Manage your store's categories, subcategories, and sizes
          </p>
        </div>
        <Link href="/admin/categories/new" className="w-full md:w-auto">
          <Button className="bg-foreground text-background hover:bg-primary hover:text-primary-foreground h-12 md:h-14 px-8 md:px-10 rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95 w-full">
            <Plus className="mr-2" size={16} /> Add New Category
          </Button>
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {categories?.map((cat) => (
          <Card
            key={cat._id}
            className="group relative overflow-hidden rounded-[3rem] border-border bg-card shadow-2xl transition-all duration-500 hover:shadow-primary/5 hover:border-primary/20"
          >
            {/* Background Texture/Accent */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <img
                src={getImageUrl(cat.image)}
                className="w-full h-full object-cover opacity-[0.03] grayscale transition-all duration-1000 group-hover:scale-110 group-hover:opacity-[0.06]"
                alt=""
              />
              <div className="absolute inset-0 bg-gradient-to-br from-background via-transparent to-background/50" />
            </div>

            <div className="relative z-10">
              {/* Header: Visual Identity & Global Actions */}
              <div className="p-6 md:p-10 flex flex-col lg:flex-row gap-8 items-center lg:items-center border-b border-border/50 bg-background/40 backdrop-blur-md text-center lg:text-left">
                <div className="relative h-32 w-32 sm:h-40 sm:w-40 shrink-0 rounded-[2.5rem] overflow-hidden border-2 border-border shadow-2xl group-hover:border-primary/40 transition-all duration-500">
                  <img
                    src={getImageUrl(cat.image)}
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                    alt={cat.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="flex-1 space-y-4 w-full">
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                    <Badge
                      variant="outline"
                      className="bg-primary/5 text-primary border-primary/20 text-[8px] font-black uppercase tracking-[0.2em] px-4 py-1"
                    >
                      Main Category
                    </Badge>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em] opacity-40">
                      ID: {cat.slug}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-foreground uppercase tracking-tighter leading-[0.9] lg:leading-[0.85] italic">
                      {cat.name}
                    </h2>
                    <div className="flex items-center justify-center lg:justify-start gap-6 mt-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-foreground">
                          {subcategories?.filter(
                            (s) =>
                              s.category?._id === cat._id ||
                              s.category === cat._id
                          ).length || 0}
                        </span>
                        <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
                          Subcategories
                        </span>
                      </div>
                      <div className="w-px h-8 bg-border/60" />
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-foreground">
                          {sizes?.filter(
                            (s) =>
                              s.category?._id === cat._id || s.category === cat._id
                          ).length || 0}
                        </span>
                        <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
                          Sizes
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 lg:flex-col justify-center lg:justify-end w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-none border-border/20">
                  <Link href={`/admin/categories/${cat._id}`} className="flex-1 lg:flex-none">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-full lg:h-14 lg:w-14 rounded-2xl bg-background border-border hover:border-primary hover:text-primary transition-all shadow-lg active:scale-95"
                    >
                      <Edit2 size={20} />
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="icon"
                    disabled={deletingCategoryId === cat._id}
                    onClick={() => handleDeleteCategory(cat._id)}
                    className="h-12 w-full lg:h-14 lg:w-14 rounded-2xl shadow-xl shadow-rose-500/20 active:scale-95 flex-1 lg:flex-none"
                  >
                    {deletingCategoryId === cat._id ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 size={20} />
                    )}
                  </Button>
                </div>
              </div>

              {/* Management Hub */}
              <CardContent className="p-6 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20">
                {/* Sub-Departments Column */}
                <div className="space-y-8">
                  <div className="flex justify-between items-center border-b border-border/40 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-xl">
                        <Layers className="text-primary" size={16} />
                      </div>
                      <h4 className="text-[11px] font-black text-foreground uppercase tracking-[0.3em]">
                        Subcategories
                      </h4>
                    </div>
                    <Link href={`/admin/subcategories/new?category=${cat._id}`}>
                      <Button
                        variant="ghost"
                        className="h-9 px-5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all"
                      >
                        <Plus size={14} className="mr-2" /> Add New
                      </Button>
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {subcategories
                      ?.filter(
                        (sub) =>
                          sub.category?._id === cat._id ||
                          sub.category === cat._id
                      )
                      .map((sub) => (
                        <div
                          key={sub._id}
                          className="group/item flex items-center justify-between bg-muted/20 hover:bg-muted/40 px-5 py-4 rounded-2xl border border-border/50 hover:border-primary/30 transition-all"
                        >
                          <Link
                            href={`/admin/subcategories/${sub._id}`}
                            className="text-[10px] font-black text-foreground uppercase tracking-widest truncate max-w-[120px]"
                          >
                            {sub.name}
                          </Link>
                          <button
                            onClick={() => handleDeleteSub(sub._id)}
                            disabled={deletingSubId === sub._id}
                            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all opacity-0 group-hover/item:opacity-100"
                          >
                            {deletingSubId === sub._id ? (
                              <div className="w-3 h-3 border border-destructive border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <X size={14} strokeWidth={3} />
                            )}
                          </button>
                        </div>
                      ))}
                    {subcategories?.filter(
                      (sub) =>
                        sub.category?._id === cat._id ||
                        sub.category === cat._id
                    ).length === 0 && (
                      <div className="col-span-full py-8 flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-3xl opacity-40">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                          No items found
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dimensional Matrix Column */}
                <div className="space-y-8">
                  <div className="flex justify-between items-center border-b border-border/40 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-xl">
                        <Maximize2 className="text-primary" size={16} />
                      </div>
                      <h4 className="text-[11px] font-black text-foreground uppercase tracking-[0.3em]">
                        Product Sizes
                      </h4>
                    </div>
                    <Link href={`/admin/sizes/new?category=${cat._id}`}>
                      <Button
                        variant="ghost"
                        className="h-9 px-5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all"
                      >
                        <Plus size={14} className="mr-2" /> Add New
                      </Button>
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {sizes
                      ?.filter(
                        (s) =>
                          s.category?._id === cat._id || s.category === cat._id
                      )
                      .map((s) => (
                        <div
                          key={s._id}
                          className="group/size flex items-center justify-between bg-muted/20 hover:bg-muted/40 px-5 py-4 rounded-2xl border border-border/50 hover:border-primary/30 transition-all"
                        >
                          <Link
                            href={`/admin/sizes/${s._id}`}
                            className="text-[10px] font-black text-foreground uppercase tracking-widest truncate max-w-[120px]"
                          >
                            {s.name}
                          </Link>
                          <button
                            onClick={() => handleDeleteSize(s._id)}
                            disabled={deletingSizeId === s._id}
                            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all opacity-0 group-hover/size:opacity-100"
                          >
                            {deletingSizeId === s._id ? (
                              <div className="w-3 h-3 border border-destructive border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <X size={14} strokeWidth={3} />
                            )}
                          </button>
                        </div>
                      ))}
                    {sizes?.filter(
                      (s) =>
                        s.category?._id === cat._id || s.category === cat._id
                    ).length === 0 && (
                      <div className="col-span-full py-8 flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-3xl opacity-40">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                          No items found
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="mt-12 flex justify-center py-8 border-t border-border/10">
          <Pagination 
            page={page} 
            totalPages={pages} 
            onPageChange={setPage} 
            className="py-0" 
          />
        </div>
      )}
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
