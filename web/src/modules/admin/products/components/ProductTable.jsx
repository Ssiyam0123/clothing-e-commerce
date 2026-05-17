"use client";

import { useAdminProducts } from "../lib/useAdminProducts";
import DataTable from "@/modules/admin/components/DataTable";
import Pagination from "@/components/common/Pagination";
import StatusBadge from "@/modules/admin/components/StatusBadge";
import ProductActionButtons from "./ProductActionButtons";
import { getImageUrl } from "@/utils/imageUtils";

export default function ProductTable() {
  const {
    products,
    pagination,
    isFetching,
    setPage,
  } = useAdminProducts();

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
      label: "Actions",
      render: (item) => <ProductActionButtons product={item} />,
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <DataTable columns={columns} data={products || []} className="border-none rounded-none" />
      
      <div className="p-8 border-t border-border/10 bg-background/5">
        <Pagination
          page={pagination?.page}
          totalPages={pagination?.pages}
          onPageChange={setPage}
          className="py-0 sm:py-0 justify-between flex-row-reverse"
        />
      </div>
    </div>
  );
}

