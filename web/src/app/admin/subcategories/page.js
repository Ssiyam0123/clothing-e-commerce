"use client";

import Link from "next/link";
import { useSubcategories } from "@/app/admin/subcategories/lib/useSubcategories";
import DataTable from "@/app/admin/_components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Plus, 
  Trash2, 
  Edit3
} from "lucide-react";
import { swalConfirm, swalToast } from "@/utils/swal";
import { cn } from "@/lib/utils";

import { useFilters } from "@/app/admin/_hooks/useFilters";
import Pagination from "@/components/common/Pagination";
import AdminPageHeader, { AdminHeaderButton } from "@/app/admin/_components/AdminPageHeader";

export default function Subcategories() {
  const { page, setPage, queryParams } = useFilters({ initialLimit: 30 });
  const { subcategories, total, pages, isLoading, deleteSubcategory } = useSubcategories(queryParams);

  const handleDelete = async (id) => {
    const isConfirmed = await swalConfirm("Delete Subcategory?", "This subcategory will be permanently removed.");
    if (isConfirmed) {
      await deleteSubcategory.mutateAsync(id);
      swalToast("Subcategory deleted", "success");
    }
  };

  const columns = [
    { label: "Name", key: "name" },
    { label: "Slug", key: "slug" },
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

  if (isLoading) {
    return (
      <div className="admin-page-container">
        <Skeleton className="h-40 w-full rounded-[2rem]" />
        <Skeleton className="h-[400px] w-full rounded-[2rem]" />
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      <AdminPageHeader
        title="Subcategories"
        description={`Manage product subcategories · ${total || 0} total`}
        actions={
          <AdminHeaderButton href="/admin/subcategories/new" icon={Plus}>
            Add subcategory
          </AdminHeaderButton>
        }
      />

      <div className="admin-table-form">
        <div className="admin-table-container border-none rounded-none pt-0">
          <DataTable
            columns={columns}
            data={subcategories}
            actions={(item) => (
              <div className="flex items-center gap-3 justify-end">
                <Button asChild variant="outline" size="icon" className="h-10 w-10 rounded-xl border-border/10 hover:border-foreground/50 hover:bg-foreground hover:text-background bg-background/50 transition-all active:scale-95">
                  <Link href={`/admin/subcategories/${item._id}`}>
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
