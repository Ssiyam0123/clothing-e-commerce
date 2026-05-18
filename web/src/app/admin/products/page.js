"use client";

import { Suspense } from "react";
import { useAdminProducts } from "@/app/admin/products/lib/useAdminProducts";
import ProductFilter from "@/app/admin/products/components/ProductFilter";
import ProductTable from "@/app/admin/products/components/ProductTable";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import AdminPageHeader, { AdminHeaderButton } from "@/app/admin/_components/AdminPageHeader";

function AdminProductsContent() {
  const { pagination, isLoading } = useAdminProducts();

  return (
    <div className="admin-page-container">
      <AdminPageHeader
        title="Products"
        description={`Manage your catalog · ${pagination?.total || 0} products`}
        actions={
          <AdminHeaderButton href="/admin/products/new" icon={Plus}>
            Add product
          </AdminHeaderButton>
        }
      />

      <div className="admin-table-form">
        <div className="p-6 md:p-8 border-b border-border/10 bg-background/20">
          <ProductFilter />
        </div>

        <div className="pt-0">
          {isLoading ? (
            <div className="p-8">
              <div className="space-y-4">
                 {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-xl" />
                 ))}
              </div>
            </div>
          ) : (
            <ProductTable />
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



