"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdminBannerCampaigns } from "@/app/admin/banner-campaigns/lib/useAdminBannerCampaigns";
import { swalConfirm, swalToast, swalError } from "@/utils/swal";
import { 
  Plus, 
  Layers, 
  Layout, 
} from "lucide-react";
import BannerCampaignCard from "./components/BannerCampaignCard";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { useFilters } from "@/app/admin/_hooks/useFilters";
import Pagination from "@/components/common/Pagination";
import AdminPageHeader, { AdminHeaderButton } from "@/app/admin/_components/AdminPageHeader";

export default function BannerCampaignListPage() {
  const { page, setPage, queryParams } = useFilters({ initialLimit: 30 });
  const { campaigns, total, pages, isLoading, deleteCampaign } = useAdminBannerCampaigns(queryParams);

  const handleDelete = async (id) => {
    const isConfirmed = await swalConfirm(
      "Delete Banner Campaign?",
      "This campaign will be permanently deleted."
    );

    if (isConfirmed) {
      try {
        await deleteCampaign(id);
        swalToast("Campaign Deleted", "success");
      } catch (err) {
        swalError("Error", "Could not delete the campaign.");
      }
    }
  };

  return (
    <div className="admin-page-container">
      <AdminPageHeader
        title="Banner campaigns"
        description={`Manage homepage banners · ${total || 0} campaigns`}
        actions={
          <AdminHeaderButton href="/admin/banner-campaigns/new" icon={Plus}>
            Create campaign
          </AdminHeaderButton>
        }
      />

      {/* Main Grid */}
      <div className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {isLoading ? (
            [1, 2, 3].map((n) => (
              <Card key={n} className="rounded-[2.5rem] border-border/10 bg-card/20 min-h-[300px] md:min-h-[400px] animate-pulse overflow-hidden">
                <CardContent className="p-10 space-y-8">
                    <div className="flex justify-between">
                      <Skeleton className="h-10 w-2/3" />
                      <Skeleton className="h-8 w-24 rounded-full" />
                    </div>
                    <Skeleton className="h-20 w-full rounded-2xl" />
                    <div className="flex gap-2">
                      <Skeleton className="h-16 w-16 rounded-xl" />
                      <Skeleton className="h-16 w-16 rounded-xl" />
                    </div>
                </CardContent>
              </Card>
            ))
          ) : !campaigns || campaigns.length === 0 ? (
            <Card className="col-span-full border-dashed border-border/20 bg-accent/5 rounded-[3rem] py-32 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mb-8 opacity-20">
                <Layout size={48} className="text-indigo-600" />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">No Banner Campaigns</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground italic">Create a new banner campaign to display on your homepage.</p>
            </Card>
          ) : (
            campaigns.map((campaign) => (
              <BannerCampaignCard 
                key={campaign._id} 
                campaign={campaign} 
                onDelete={handleDelete} 
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-center pt-8 border-t border-border/5">
            <Pagination 
              page={page} 
              totalPages={pages} 
              onPageChange={setPage} 
              className="py-0" 
            />
          </div>
        )}
      </div>
    </div>
  );
}



