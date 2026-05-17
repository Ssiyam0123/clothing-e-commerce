"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdminBannerCampaigns } from "@/app/admin/banner-campaigns/lib/useAdminBannerCampaigns";
import { getImageUrl } from "@/utils/imageUtils";
import { swalConfirm, swalToast, swalError } from "@/utils/swal";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Layers, 
  Layout, 
  Settings2,
  TrendingUp,
  FileImage,
  Power
} from "lucide-react";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { useFilters } from "@/app/_common/lib/useFilters";
import Pagination from "@/components/common/Pagination";

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
      {/* Header */}
      <div className="admin-section-header">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
             <Badge variant="outline" className="text-[8px] md:text-[9px] uppercase tracking-widest border-indigo-600/30 text-indigo-600 bg-indigo-600/5 px-3 py-1">Banners</Badge>
          </div>
          <h1 className="admin-title">
            Banner <span className="text-indigo-600">Campaigns</span>
          </h1>
          <p className="admin-subtitle">
            Manage your storefront banners • Total: {total}
          </p>
        </div>

        <Button
          asChild
          className="bg-foreground text-background hover:bg-indigo-600 hover:text-white h-12 md:h-16 px-8 md:px-10 rounded-xl md:rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 group w-full md:w-auto"
        >
          <Link href="/admin/banner-campaigns/new">
            <Plus size={18} className="mr-3 transition-transform group-hover:rotate-90" /> Create Banner
          </Link>
        </Button>
      </div>

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
              <Card key={campaign._id} className="group rounded-[2.5rem] border-border/10 bg-card/30 backdrop-blur-xl shadow-xl hover:shadow-indigo-600/5 transition-all duration-700 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                
                <CardHeader className="p-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                      <CardTitle className="text-2xl font-black uppercase tracking-tighter leading-none group-hover:text-indigo-600 transition-colors duration-500">
                        {campaign.name}
                      </CardTitle>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                        ID: {campaign._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    {campaign.isActive && (
                      <Badge className="bg-indigo-600 text-white border-none rounded-full px-4 py-1 text-[9px] font-bold uppercase tracking-widest">
                        In Use
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-xs font-medium text-muted-foreground line-clamp-2 leading-relaxed">
                    {campaign.description || "No description provided."}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-10 pt-0 space-y-8">
                  {/* Deck Visualization */}
                  <div className="bg-accent/5 border border-border/5 rounded-[1.5rem] p-6 relative">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-2">
                          <FileImage size={12} /> Banner Image
                      </span>
                      <span className="text-[10px] font-black text-indigo-600 bg-indigo-600/10 px-3 py-0.5 rounded-full uppercase tracking-widest">
                          Preview
                      </span>
                    </div>
                    <div className="flex overflow-hidden">
                      {campaign.slides.slice(0, 1).map((slide, idx) => (
                        <div
                          key={idx}
                          className="w-full h-32 rounded-2xl overflow-hidden border border-border/10 shadow-lg shrink-0 relative group/img"
                        >
                          {slide.image ? (
                            <img
                              src={getImageUrl(slide.image)}
                              alt="campaign preview"
                              className="w-full h-full object-cover grayscale group-hover/img:grayscale-0 transition-all duration-700"
                            />
                          ) : (
                            <div className="w-full h-full bg-accent/10 flex items-center justify-center">
                              <FileImage size={24} className="text-muted-foreground/30" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Button asChild variant="outline" className="flex-1 h-14 rounded-xl border-border/10 text-[10px] font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all">
                      <Link href={`/admin/banner-campaigns/${campaign._id}`}>
                        <Settings2 size={14} className="mr-2" /> Edit Banner
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleDelete(campaign._id)}
                      className="h-14 w-14 rounded-xl border-border/10 hover:border-rose-600/50 hover:bg-rose-600 hover:text-white transition-all"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
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



