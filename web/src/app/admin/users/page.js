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
      return swalError("Termination Revoked", "Core administrative identities cannot be purged.");
    }
    const isConfirmed = await swalConfirm("Terminate Identity?", "This personnel record will be permanently erased.");
    if (isConfirmed) {
      try {
        await deleteUser.mutateAsync(id);
        swalToast("Identity Purged", "success");
      } catch (err) {
        swalError("System Error", "Purge protocol rejected by security module.");
      }
    }
  };

  const columns = [
    {
      label: "Personnel Identity",
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
      label: "Clearance Level",
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
          {item.role === "admin" ? "★ Vanguard Admin" : "Syndicate Member"}
        </Badge>
      ),
    },
    {
      label: "Inception Date",
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
      label: "Command Ops",
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
    <div className="space-y-10 pb-24 px-4 sm:px-6 max-w-[1600px] mx-auto">
      {/* 🛰️ Tactical Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 bg-card/30 p-10 rounded-[3rem] border border-border/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-600/5 blur-[100px] rounded-full -mr-20 -mt-20 group-hover:bg-zinc-600/10 transition-colors duration-1000" />
        
        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-3">
             <Badge variant="outline" className="text-[9px] uppercase tracking-widest border-border/20 text-muted-foreground bg-accent/5 px-3 py-1">Identity Ops</Badge>
             <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black opacity-40">// DIRECTORY_v4.2</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-black uppercase tracking-tighter dark:text-white italic leading-none">
            User <span className="text-muted-foreground">Directory</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground flex items-center gap-3">
            <UserCheck size={12} className="text-foreground animate-pulse" /> Personnel Management • Global Search Enabled
          </p>
        </div>

        <div className="bg-accent/5 px-8 py-5 rounded-[2rem] border border-border/10 flex items-center gap-6 shadow-inner relative z-10 group/stat">
           <div className="flex flex-col">
              <span className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-1">Sector Live</span>
              <span className="text-3xl font-black text-foreground italic leading-none group-hover/stat:text-rose-600 transition-colors">
                {total || 0}
              </span>
           </div>
           <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-muted-foreground">
              <Activity size={20} className="animate-pulse" />
           </div>
        </div>
      </header>

      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
            { label: "🌟 Default Sequence", value: "-createdAt" },
            { label: "Newest Joined", value: "-createdAt" },
            { label: "Oldest Joined", value: "createdAt" },
            { label: "Alphabetical (A-Z)", value: "name" },
            { label: "Clearance Level", value: "-role" },
          ]}
          searchPlaceholder="Search by Name or Email..."
        />

        <Card className="rounded-[3rem] border-border/10 bg-card/30 backdrop-blur-2xl shadow-2xl overflow-hidden relative">
          <CardContent className="p-0">
            {isLoading ? (
              <TableSkeleton rowCount={10} colCount={4} />
            ) : (
              <div className={cn("transition-all duration-300", isFetching && "opacity-50 blur-[2px] pointer-events-none")}>
                 <DataTable columns={columns} data={users || []} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* 🚀 Sector Navigation (Pagination) */}
        {!isLoading && totalPages > 1 && (
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-4 px-6">
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.5em] italic">
              Navigating Sector {currentPage} <span className="mx-3 opacity-20">/</span> {totalPages}
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="h-12 w-12 rounded-2xl bg-card/50 border-border/10 hover:bg-foreground hover:text-background transition-all"
              >
                <ChevronLeft size={20} strokeWidth={3} />
              </Button>

              <div className="flex items-center gap-2 px-2">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                    return (
                      <Button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        className={cn(
                          "w-12 h-12 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all",
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
                className="h-12 w-12 rounded-2xl bg-card/50 border-border/10 hover:bg-foreground hover:text-background transition-all"
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
        <div className="p-10 space-y-10">
          <Skeleton className="h-[120px] rounded-[3rem]" />
          <Skeleton className="h-20 rounded-full" />
          <Skeleton className="h-[600px] rounded-[3rem]" />
        </div>
      }
    >
      <UsersContent />
    </Suspense>
  );
}
