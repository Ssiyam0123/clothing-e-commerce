"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useAdminProducts } from "@/hooks/admin/useAdminProducts";
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
      label: "Ratings",
      render: (item) => (
        <button
          onClick={async () => {
             try {
               await updateProduct({ id: item._id, data: { showReviews: !item.showReviews } });
               swalToast(item.showReviews ? "Reviews Suppressed" : "Reviews Authorized", "success");
             } catch (err) {
               swalError("Protocol Error", err.message);
             }
          }}
          className={`inline-flex items-center px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full border transition-all hover:scale-105 active:scale-95 cursor-pointer ${
            item.showReviews !== false
              ? "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 hover:bg-indigo-500/20"
              : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
          }`}
        >
          {item.showReviews !== false ? "★ Active" : "☆ Off"}
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
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-section-header">
        <div>
          <h1 className="admin-title">
            Product <span className="text-muted-foreground/50">Catalog</span>
          </h1>
          <p className="admin-subtitle">
            Manage Store Inventory (Items: {pagination?.total || 0})
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-foreground text-background px-8 md:px-10 py-3 md:py-4 rounded-full font-black uppercase tracking-widest text-[9px] md:text-[10px] hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <Plus size={16} strokeWidth={3} />
          Initialize Product
        </Link>
      </div>

      <div className="admin-table-form">
        <div className="p-6 md:p-8 border-b border-border/10 bg-background/20">
          <AdminProductFilter />
        </div>

        <div className="pt-0">
          {isLoading ? (
            <div className="p-8">
              <TableSkeleton rowCount={10} colCount={6} />
            </div>
          ) : (
            <div
              className={`animate-in fade-in slide-in-from-bottom-4 duration-700 transition-opacity ${
                isFetching ? "opacity-50 pointer-events-none" : "opacity-100"
              }`}
            >
              <DataTable columns={columns} data={products || []} className="border-none rounded-none" />
              {pagination?.pages > 1 && (
                <div className="p-8 border-t border-border/10 bg-background/10">
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
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="admin-page-container">
          <Skeleton className="min-h-[120px] w-full rounded-[2.5rem]" />
          <Skeleton className="min-h-[80px] w-full rounded-full" />
          <div className="flex flex-wrap gap-4">
             {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-10 w-24 md:w-32 rounded-full" />)}
          </div>
          <Skeleton className="min-h-[500px] w-full rounded-[2.5rem]" />
        </div>
      }
    >
      <AdminProductsContent />
    </Suspense>
  );
}
