// src/app/admin/products/page.js
"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import DataTable from "@/components/admin/DataTable";
import Loader from "@/components/common/Loader";
import TableSkeleton from "@/components/common/TableSkeleton";
import Pagination from "@/components/common/Pagination";
import AdminProductFilter from "@/components/admin/AdminProductFilter";
import { getImageUrl } from "@/utils/imageUtils";
import { swalConfirm, swalToast, swalError } from "@/utils/swal";

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
      // Show detailed error from server if available
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
          <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shrink-0">
            <img
              src={getImageUrl(item.images?.[0])}
              alt={item.name}
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
          <div>
            <p className="text-sm font-black text-zinc-900 dark:text-zinc-100 leading-none mb-1 uppercase tracking-tight line-clamp-1">
              {item.name}
            </p>
            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
              {item.category?.name || "Uncategorized"}
            </p>
          </div>
        </div>
      ),
    },
    {
      label: "Price",
      render: (item) => (
        <span className="font-black text-zinc-900 dark:text-white">
          ৳{item.price.toFixed(2)}
        </span>
      ),
    },
    {
      label: "Inventory",
      render: (item) => {
        const stock = item.totalStock ?? 0;
        return (
          <div className="flex flex-col gap-1">
            <span
              className={`inline-flex items-center justify-center px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border w-fit ${
                stock === 0
                  ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                  : stock < 10
                    ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
              }`}
            >
              {stock === 0
                ? "Out of Stock"
                : stock < 10
                  ? "Low Stock"
                  : "In Stock"}
            </span>
            <span className="text-[10px] font-bold text-zinc-500">
              {stock} Units
            </span>
          </div>
        );
      },
    },
    {
      label: "Visibility",
      render: (item) => (
        <button
          onClick={() => handleToggleActive(item._id, item.isActive)}
          className={`inline-flex items-center px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full border transition-all hover:scale-105 active:scale-95 cursor-pointer ${
            item.isActive
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200"
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
            className="p-2.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-black rounded-xl transition-all shadow-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </Link>
          <Link
            href={`/admin/products/${item._id}`}
            className="p-2.5 bg-zinc-100 dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-xl transition-all shadow-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </Link>
          <button
            onClick={() => handleDelete(item._id)}
            className="p-2.5 bg-zinc-100 dark:bg-zinc-900 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase mb-2">
            Product Catalog
          </h1>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">
            Manage Store Inventory (Items: {pagination?.total || 0})
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-zinc-900 dark:bg-white text-white dark:text-black px-10 py-4 rounded-full font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-xl"
        >
          + Initialize Product
        </Link>
      </div>

      <AdminProductFilter />

      <div className="pt-4">
        {isLoading ? (
          <TableSkeleton rowCount={10} colCount={5} />
        ) : (
          <div
            className={`animate-in fade-in slide-in-from-bottom-4 duration-700 transition-opacity ${
              isFetching ? "opacity-50 pointer-events-none" : "opacity-100"
            }`}
          >
            <DataTable columns={columns} data={products || []} />
            <Pagination
              page={pagination?.page}
              totalPages={pagination?.pages}
              onPageChange={setPage}
            />
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
        <div className="p-20">
          <Loader />
        </div>
      }
    >
      <AdminProductsContent />
    </Suspense>
  );
}
