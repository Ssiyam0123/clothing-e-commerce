"use client";

import { useState, useMemo, useCallback, Suspense } from "react";
import Link from "next/link";
import { useUsers } from "@/hooks/useUsers";
import { useFilters } from "@/hooks/useFilters";
import DataTable from "@/components/admin/DataTable";
import TableSkeleton from "@/components/common/TableSkeleton";
import FilterBar from "@/components/common/FilterBar";
import { getImageUrl } from "@/utils/imageUtils";
import { swalConfirm, swalToast, swalError } from "@/utils/swal";
import { 
  Users as UsersIcon, 
  Trash2, 
  Edit3, 
  ChevronLeft, 
  ChevronRight, 
  UserCheck,
  Activity,
  Cpu,
  Eye
} from "lucide-react";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function UsersContent() {
  const { 
    search, 
    setSearch, 
    sort, 
    setSort, 
    page: currentPage, 
    setPage, 
    queryParams 
  } = useFilters({
    initialLimit: 10,
    initialSort: "-createdAt"
  });

  const { 
    users, 
    total, 
    pages: totalPages, 
    isLoading, 
    isFetching,
    deleteUser 
  } = useUsers(queryParams);

  const handleSearch = useCallback((val) => {
    setSearch(val);
    setPage(1);
  }, [setSearch, setPage]);

  const handleDelete = async (id, role) => {
    if (role === "admin") {
      return swalError("Action Denied", "Admin users cannot be deleted.");
    }
    const isConfirmed = await swalConfirm("Delete User?", "This user will be permanently deleted.");
    if (isConfirmed) {
      try {
        await deleteUser.mutateAsync(id);
        swalToast("User deleted", "success");
      } catch (err) {
        swalError("Error", "Could not delete user.");
      }
    }
  };

  const columns = [
    {
      label: "User Details",
      render: (item) => (
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-12 rounded-2xl overflow-hidden border border-border/10 shrink-0 bg-accent/5 group/avatar">
            {item.avatar ? (
              <img
                src={getImageUrl(item.avatar)}
                alt={item.name}
                className="w-full h-full object-cover grayscale group-hover/avatar:grayscale-0 transition-all duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground font-black text-xs uppercase italic">
                {item.name?.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <p className="text-[13px] font-black text-foreground leading-none mb-1 uppercase tracking-tighter italic">
              {item.name}
            </p>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
              {item.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      label: "Role",
      render: (item) => (
        <Badge
          variant="outline"
          className={cn(
            "px-4 py-1.5 text-[8px] font-black uppercase tracking-[0.2em] rounded-full",
            item.role === "admin"
              ? "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
              : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
          )}
        >
          {item.role === "admin" ? "Admin" : "Customer"}
        </Badge>
      ),
    },
    {
      label: "Joined Date",
      render: (item) => (
        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">
          {new Date(item.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      label: "Actions",
      render: (item) => (
        <div className="flex items-center gap-3 justify-end">
          <Button 
            asChild 
            variant="outline" 
            size="icon" 
            className="h-10 w-10 rounded-xl border-border/10 hover:border-blue-600/50 hover:bg-blue-600 hover:text-white bg-background/50 transition-all active:scale-95 group"
          >
            <Link href={`/admin/users/${item._id}`}>
              <Eye size={16} className="group-hover:scale-110 transition-transform" />
            </Link>
          </Button>
          <Button 
            asChild 
            variant="outline" 
            size="icon" 
            className="h-10 w-10 rounded-xl border-border/10 hover:border-foreground/50 hover:bg-foreground hover:text-background bg-background/50 transition-all active:scale-95"
          >
            <Link href={`/admin/users/${item._id}/edit`}>
              <Edit3 size={16} />
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleDelete(item._id, item.role)}
            className="h-10 w-10 rounded-xl border-border/10 hover:border-rose-600/50 hover:bg-rose-600 hover:text-white bg-background/50 transition-all active:scale-95"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="admin-page-container">
      {/* 🛰️ Tactical Header */}
      <div className="admin-section-header">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
             <Badge variant="outline" className="text-[8px] md:text-[9px] uppercase tracking-widest border-border/20 text-muted-foreground bg-accent/5 px-3 py-1">Users</Badge>
          </div>
          <h1 className="admin-title">
            User <span className="text-muted-foreground">Directory</span>
          </h1>
          <p className="admin-subtitle">
            Manage your store's users
          </p>
        </div>

        <div className="bg-accent/5 px-6 md:px-8 py-3 md:py-5 rounded-2xl md:rounded-[2rem] border border-border/10 flex items-center justify-between md:justify-start gap-4 md:gap-6 shadow-inner w-full md:w-auto group/stat">
           <div className="flex flex-col">
              <span className="text-[8px] md:text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-1">Total Users</span>
              <span className="text-xl md:text-3xl font-black text-foreground italic leading-none group-hover/stat:text-rose-600 transition-colors">
                {total || 0}
              </span>
           </div>
           <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-background flex items-center justify-center text-muted-foreground">
              <Activity size={16} className="md:size-5 animate-pulse" />
           </div>
        </div>
      </div>

      <div className="admin-table-form animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="p-6 md:p-8 border-b border-border/10 bg-background/20">
          <FilterBar
            search={search}
            onSearchSubmit={handleSearch}
            onSearchChange={handleSearch}
            sort={sort}
            onSortChange={setSort}
            suggestionEndpoint="/users"
            suggestionKey="users"
            entityType="user"
            sortOptions={[
              { label: "Default", value: "-createdAt" },
              { label: "Newest Joined", value: "-createdAt" },
              { label: "Oldest Joined", value: "createdAt" },
              { label: "Alphabetical (A-Z)", value: "name" },
              { label: "Role", value: "-role" },
            ]}
            searchPlaceholder="Search by Name or Email..."
          />
        </div>

        <div className="pt-0">
          {isLoading ? (
            <div className="p-8">
              <TableSkeleton rowCount={10} colCount={4} />
            </div>
          ) : (
            <div className={cn("transition-all duration-300", isFetching && "opacity-50 blur-[2px] pointer-events-none")}>
               <DataTable columns={columns} data={users || []} className="border-none rounded-none" />
            </div>
          )}
        </div>

        {/* 🚀 Sector Navigation (Pagination) */}
        {!isLoading && totalPages > 1 && (
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 p-6 md:p-8 border-t border-border/10 bg-background/10">
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.5em] italic">
              Page {currentPage} <span className="mx-3 opacity-20">/</span> {totalPages}
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-card/50 border-border/10 hover:bg-foreground hover:text-background transition-all"
              >
                <ChevronLeft size={20} strokeWidth={3} />
              </Button>

              <div className="flex items-center gap-2 px-1 md:px-2">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                    return (
                      <Button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        className={cn(
                          "w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all",
                          currentPage === pageNum 
                            ? "bg-rose-600 text-white shadow-xl shadow-rose-600/20 scale-110 border-transparent" 
                            : "bg-card/50 border-border/10 text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {pageNum < 10 ? `0${pageNum}` : pageNum}
                      </Button>
                    );
                  }
                  if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return <span key={pageNum} className="text-muted-foreground/30 text-[10px] px-1 font-black">••</span>;
                  }
                  return null;
                })}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-card/50 border-border/10 hover:bg-foreground hover:text-background transition-all"
              >
                <ChevronRight size={20} strokeWidth={3} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Users() {
  return (
    <Suspense
      fallback={
        <div className="admin-page-container">
          <Skeleton className="min-h-[120px] w-full rounded-[3rem]" />
          <Skeleton className="h-20 w-full rounded-full" />
          <Skeleton className="min-h-[500px] w-full rounded-[3rem]" />
        </div>
      }
    >
      <UsersContent />
    </Suspense>
  );
}
