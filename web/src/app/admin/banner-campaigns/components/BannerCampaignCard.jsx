"use client";

import Link from "next/link";
import { Settings2, Trash2, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getImageUrl } from "@/utils/imageUtils";

export default function BannerCampaignCard({ campaign, onDelete }) {
  return (
    <Card className="group rounded-[2.5rem] border-border/10 bg-card/30 backdrop-blur-xl shadow-xl hover:shadow-indigo-600/5 transition-all duration-700 overflow-hidden relative">
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
            onClick={() => onDelete(campaign._id)}
            className="h-14 w-14 rounded-xl border-border/10 hover:border-rose-600/50 hover:bg-rose-600 hover:text-white transition-all"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
