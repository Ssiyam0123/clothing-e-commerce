"use client";

import Link from "next/link";
import { useState } from "react";
import { useAdminProducts } from "../lib/useAdminProducts";
import { swalConfirm, swalToast, swalError } from "@/utils/swal";
import { Edit, Trash2, Settings, History, Eye, EyeOff, Star, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProductActionButtons({ product }) {
  const { deleteProduct, patchProduct } = useAdminProducts();
  
  const [loadingActive, setLoadingActive] = useState(false);
  const [loadingFeatured, setLoadingFeatured] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleDelete = async (id) => {
    const confirmed = await swalConfirm(
      "Delete Product?",
      "This action is permanent.",
    );
    if (!confirmed) return;

    setLoadingDelete(true);
    try {
      await deleteProduct(id);
      swalToast("Product Deleted", "success");
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Something went wrong.";
      swalError("Action Failed", message);
      console.error("Delete error:", err);
      setLoadingDelete(false);
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    setLoadingActive(true);
    try {
      await patchProduct({ id, data: { isActive: !currentStatus } });
      swalToast(currentStatus ? "Product Hidden" : "Product Public", "success");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Could not update status.";
      swalError("Visibility Error", message);
      console.error("Toggle active error:", err);
    } finally {
      setLoadingActive(false);
    }
  };

  const handleToggleFeatured = async (id, currentFeatured) => {
    setLoadingFeatured(true);
    try {
      await patchProduct({ id, data: { isFeatured: !currentFeatured } });
      swalToast(currentFeatured ? "Removed from Featured" : "Marked as Featured", "success");
    } catch (err) {
      swalError("Update Error", err.message);
    } finally {
      setLoadingFeatured(false);
    }
  };

  const handleToggleReviews = async (id, currentReviews) => {
    setLoadingReviews(true);
    try {
      await patchProduct({ id, data: { showReviews: !currentReviews } });
      swalToast(currentReviews ? "Reviews Disabled" : "Reviews Enabled", "success");
    } catch (err) {
      swalError("Update Error", err.message);
    } finally {
      setLoadingReviews(false);
    }
  };

  return (
    <div className="flex items-center gap-2 justify-end">
      {/* Visibility Toggle */}
      <button
        onClick={() => handleToggleActive(product._id, product.isActive)}
        disabled={loadingActive}
        className={cn(
          "p-2.5 rounded-xl transition-all shadow-sm border flex items-center justify-center min-w-9 min-h-9",
          product.isActive 
            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500 hover:text-white" 
            : "bg-muted text-muted-foreground border-border hover:bg-foreground hover:text-background"
        )}
        title={product.isActive ? "Hide Product" : "Publish Product"}
      >
        {loadingActive ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : product.isActive ? (
          <Eye size={16} strokeWidth={2.5} />
        ) : (
          <EyeOff size={16} strokeWidth={2.5} />
        )}
      </button>

      {/* Featured Toggle */}
      <button
        onClick={() => handleToggleFeatured(product._id, product.isFeatured)}
        disabled={loadingFeatured}
        className={cn(
          "p-2.5 rounded-xl transition-all shadow-sm border flex items-center justify-center min-w-9 min-h-9",
          product.isFeatured 
            ? "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500 hover:text-white" 
            : "bg-muted text-muted-foreground border-border hover:bg-foreground hover:text-background"
        )}
        title={product.isFeatured ? "Unfeature" : "Feature on Homepage"}
      >
        {loadingFeatured ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <Star size={16} strokeWidth={2.5} fill={product.isFeatured ? "currentColor" : "none"} />
        )}
      </button>

      {/* Reviews Toggle */}
      <button
        onClick={() => handleToggleReviews(product._id, product.showReviews !== false)}
        disabled={loadingReviews}
        className={cn(
          "p-2.5 rounded-xl transition-all shadow-sm border flex items-center justify-center min-w-9 min-h-9",
          product.showReviews !== false 
            ? "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 hover:bg-indigo-500 hover:text-white" 
            : "bg-muted text-muted-foreground border-border hover:bg-foreground hover:text-background"
        )}
        title={product.showReviews !== false ? "Disable Reviews" : "Enable Reviews"}
      >
        {loadingReviews ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <MessageSquare size={16} strokeWidth={2.5} />
        )}
      </button>

      <div className="w-px h-6 bg-border/20 mx-1" />

      {/* Sales History */}
      <Link
        href={`/admin/products/${product._id}/history`}
        className="p-2.5 bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500 hover:text-white rounded-xl transition-all shadow-sm flex items-center justify-center min-w-9 min-h-9"
        title="Sales History"
      >
        <History className="w-4 h-4" strokeWidth={2.5} />
      </Link>

      {/* Sizes & Stock */}
      <Link
        href={`/admin/products/${product._id}/manage`}
        className="p-2.5 bg-muted text-muted-foreground hover:bg-foreground hover:text-background rounded-xl transition-all shadow-sm flex items-center justify-center min-w-9 min-h-9"
        title="Sizes & Stock"
      >
        <Settings className="w-4 h-4" strokeWidth={2.5} />
      </Link>

      {/* Edit Product */}
      <Link
        href={`/admin/products/${product._id}`}
        className="p-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-xl transition-all shadow-sm flex items-center justify-center min-w-9 min-h-9"
        title="Edit Product"
      >
        <Edit className="w-4 h-4" strokeWidth={2.5} />
      </Link>

      {/* Delete Permanently */}
      <button
        onClick={() => handleDelete(product._id)}
        disabled={loadingDelete}
        className="p-2.5 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-xl transition-all shadow-sm flex items-center justify-center min-w-9 min-h-9"
        title="Delete Permanently"
      >
        {loadingDelete ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4" strokeWidth={2.5} />
        )}
      </button>
    </div>
  );
}
