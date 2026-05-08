"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import DataTable from "@/components/admin/DataTable";
import TableSkeleton from "@/components/common/TableSkeleton";
import Pagination from "@/components/common/Pagination";
import AdminProductFilter from "@/components/admin/AdminProductFilter";
import StatusBadge from "@/components/admin/StatusBadge";
import { getImageUrl } from "@/utils/imageUtils";
import { swalConfirm, swalToast, swalError } from "@/utils/swal";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Settings, Plus } from "lucide-react";

function AdminProductsContent() {
  const {
    products,
    pagination,
    isLoading,
    isFetching,
    deleteProduct,
    updateProduct,
    setPage,
  } = useAdminProducts();

  const handleDelete = async (id) => {
    const confirmed = await swalConfirm(
      "Purge Product?",
      "This action is permanent.",
    );
    if (!confirmed) return;

    try {
      await deleteProduct(id);
      swalToast("Product Purged", "success");
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Something went wrong.";
      swalError("Action Failed", message);
      console.error("Delete error:", err);
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await updateProduct({ id, data: { isActive: !currentStatus } });
      swalToast(currentStatus ? "Product Hidden" : "Product Public", "success");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Could not sync with databanks.";
      swalError("Visibility Error", message);
      console.error("Toggle active error:", err);
    }
  };

  const columns = [
    {
      label: "Product Info",
      render: (item) => (
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-border shrink-0">
            <img
              src={getImageUrl(item.images?.[0])}
              alt={item.name}
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
          <div>
            <p className="text-sm font-black text-foreground leading-none mb-1 uppercase tracking-tight line-clamp-1">
              {item.name}
            </p>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
              {item.category?.name || "Uncategorized"}
            </p>
          </div>
        </div>
      ),
    },
    {
      label: "Price",
      render: (item) => (
        <span className="font-black text-foreground">
          ৳{item.price.toFixed(2)}
        </span>
      ),
    },
    {
      label: "Inventory",
      render: (item) => {
        const stock = item.totalStock ?? 0;
        let status = "In Stock";
        if (stock === 0) status = "Out of Stock";
        else if (stock < 10) status = "Low Stock";
        
        return (
          <div className="flex flex-col gap-1">
            <StatusBadge value={status} />
            <span className="text-[10px] font-bold text-muted-foreground ml-1">
              {stock} Units
            </span>
          </div>
        );
      },
    },
    {
      label: "Featured",
      render: (item) => (
        <button
          onClick={async () => {
             try {
               await updateProduct({ id: item._id, data: { isFeatured: !item.isFeatured } });
               swalToast(item.isFeatured ? "Removed from Featured" : "Marked as Featured", "success");
             } catch (err) {
               swalError("Update Error", err.message);
             }
          }}
          className={`inline-flex items-center px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full border transition-all hover:scale-105 active:scale-95 cursor-pointer ${
            item.isFeatured
              ? "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20"
              : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
          }`}
        >
          {item.isFeatured ? "★ Featured" : "☆ Standard"}
        </button>
      ),
    },
    {
      label: "Visibility",
      render: (item) => (
        <button
          onClick={() => handleToggleActive(item._id, item.isActive)}
          className={`inline-flex items-center px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full border transition-all hover:scale-105 active:scale-95 cursor-pointer ${
            item.isActive
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20"
              : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
          }`}
        >
          {item.isActive ? "● Public" : "○ Hidden"}
        </button>
      ),
    },
    {
      label: "Actions",
      render: (item) => (
        <div className="flex items-center gap-2 justify-end">
          <Link
            href={`/admin/products/${item._id}/manage`}
            className="p-2.5 bg-muted text-muted-foreground hover:bg-foreground hover:text-background rounded-xl transition-all shadow-sm"
            title="Variants & Inventory"
          >
            <Settings className="w-4 h-4" strokeWidth={2.5} />
          </Link>
          <Link
            href={`/admin/products/${item._id}`}
            className="p-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-xl transition-all shadow-sm"
            title="Edit Base Info"
          >
            <Edit className="w-4 h-4" strokeWidth={2.5} />
          </Link>
          <button
            onClick={() => handleDelete(item._id)}
            className="p-2.5 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-xl transition-all shadow-sm"
            title="Delete Permanently"
          >
            <Trash2 className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto overflow-x-hidden animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-card p-8 rounded-[2.5rem] border border-border shadow-sm">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tighter uppercase mb-2 italic">
            Product <span className="text-muted-foreground/50">Catalog</span>
          </h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
            Manage Store Inventory (Items: {pagination?.total || 0})
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-foreground text-background px-10 py-4 rounded-full font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-2"
        >
          <Plus size={16} strokeWidth={3} />
          Initialize Product
        </Link>
      </div>

      <AdminProductFilter />

      <div className="pt-4">
        {isLoading ? (
          <TableSkeleton rowCount={10} colCount={6} />
        ) : (
          <div
            className={`animate-in fade-in slide-in-from-bottom-4 duration-700 transition-opacity ${
              isFetching ? "opacity-50 pointer-events-none" : "opacity-100"
            }`}
          >
            <DataTable columns={columns} data={products || []} />
            {pagination?.pages > 1 && (
              <div className="mt-12 flex justify-center">
                <Pagination
                  page={pagination?.page}
                  totalPages={pagination?.pages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 space-y-10">
          <Skeleton className="h-[120px] rounded-[2.5rem]" />
          <Skeleton className="h-24 rounded-full" />
          <div className="flex gap-4">
             {[1,2,3,4].map(i => <Skeleton key={i} className="h-12 w-32 rounded-full" />)}
          </div>
          <Skeleton className="h-[600px] rounded-[2.5rem]" />
        </div>
      }
    >
      <AdminProductsContent />
    </Suspense>
  );
}
