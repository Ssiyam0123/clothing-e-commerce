"use client";

import { useState } from "react";
import Link from "next/link";
import { useSizes } from "@/hooks/useSizes";
import { useAdminCategories } from "@/hooks/admin/useAdminCategories";
import DataTable from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Filter
} from "lucide-react";
import { swalConfirm, swalToast } from "@/utils/swal";
import { cn } from "@/lib/utils";

import { useFilters } from "@/hooks/useFilters";
import Pagination from "@/components/common/Pagination";

export default function Sizes() {
  const { page, setPage, category: selectedCategory, setCategory: setSelectedCategory, queryParams } = useFilters({ initialLimit: 30 });
  const { categories, isLoading: categoriesLoading } = useAdminCategories();
  const { sizes, total, pages, isLoading, deleteSize } = useSizes(queryParams);

  const handleDelete = async (id) => {
    const isConfirmed = await swalConfirm("Delete Size?", "This size will be permanently removed.");
    if (isConfirmed) {
      await deleteSize.mutateAsync(id);
      swalToast("Size deleted", "success");
    }
  };

  const columns = [
    { label: "Name", key: "name" },
    { label: "Description", key: "description" },
    {
      label: "Category",
      key: "category",
      render: (item) => (
        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border-border/10 bg-background/50">
          {item.category?.name}
        </Badge>
      ),
    },
  ];

  if (isLoading || categoriesLoading) {
    return (
      <div className="admin-page-container">
        <Skeleton className="h-40 w-full rounded-[2rem]" />
        <Skeleton className="h-20 w-full rounded-full" />
        <Skeleton className="h-[400px] w-full rounded-[2rem]" />
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      {/* 🛰️ System Header */}
      <div className="admin-section-header">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
             <Badge variant="outline" className="text-[9px] uppercase tracking-widest border-indigo-600/30 text-indigo-600 bg-indigo-600/5 px-3 py-1">Sizes</Badge>
          </div>
          <h1 className="admin-title">
            Product <span className="text-indigo-600">Sizes</span>
          </h1>
          <p className="admin-subtitle">
            Manage your product sizes • Total: {total}
          </p>
        </div>

        <Button
          asChild
          className="bg-foreground text-background hover:bg-indigo-600 hover:text-white h-12 md:h-16 px-8 md:px-10 rounded-xl md:rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 group w-full md:w-auto"
        >
          <Link href="/admin/sizes/new">
            <Plus size={18} className="mr-3 transition-transform group-hover:rotate-90" /> Add New Size
          </Link>
        </Button>
      </div>

      {/* 📟 Tactical Filter & Data */}
      <div className="admin-table-form">
        <div className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-8 border-b border-border/10 bg-background/20 backdrop-blur-xl">
          <div className="flex items-center gap-4 text-muted-foreground">
            <Filter size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Filter by Category</span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-background/50 border border-border/10 rounded-xl h-12 md:h-14 px-6 text-[10px] font-black uppercase tracking-widest w-full md:w-64 focus:border-indigo-600 transition-all outline-none"
          >
            <option value="all">All Categories</option>
            {categories?.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-table-container border-none rounded-none pt-0">
          <DataTable
            columns={columns}
            data={sizes}
            actions={(item) => (
              <div className="flex items-center gap-3 justify-end">
                <Button asChild variant="outline" size="icon" className="h-10 w-10 rounded-xl border-border/10 hover:border-foreground/50 hover:bg-foreground hover:text-background bg-background/50 transition-all active:scale-95">
                  <Link href={`/admin/sizes/${item._id}`}>
                    <Edit3 size={16} />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleDelete(item._id)}
                  className="h-10 w-10 rounded-xl border-border/10 hover:border-rose-600/50 hover:bg-rose-600 hover:text-white bg-background/50 transition-all active:scale-95"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            )}
          />
        </div>
        
        {/* Pagination */}
        <div className="p-8 border-t border-border/10 bg-background/5">
           <Pagination 
             page={page} 
             totalPages={pages} 
             onPageChange={setPage} 
             className="py-0 sm:py-0 justify-between flex-row-reverse" 
           />
        </div>
      </div>
    </div>
  );
}
