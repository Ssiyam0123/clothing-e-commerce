"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormInput from "@/app/admin/_components/FormInput";
import { cn } from "@/lib/utils";

export default function MarketingPage() {
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState({
    fbPixelId: "",
    fbAccessToken: "",
    fbTestEventCode: "",
    gtmId: "",
    tiktokPixelId: "",
    tiktokAccessToken: "",
    snapPixelId: "",
    pinterestTagId: "",
    googleAdsId: "",
    clarityId: ""
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get("/settings");
        if (data?.marketing) {
          setFormData(data.marketing);
        }
      } catch (error) {
        toast.error("Failed to load marketing settings.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("marketing", JSON.stringify(formData));
      await api.put("/settings", payload);
      toast.success("Marketing tracking updated!");
    } catch (error) {
      toast.error("Failed to update marketing settings.");
    } finally {
      setLoading(false);
    }
  };

  if (isFetching) return <div className="animate-pulse h-96 bg-muted rounded-3xl" />;

  return (
    <Card className="rounded-[2rem] md:rounded-[3rem] border-border/10 bg-card/30 backdrop-blur-2xl shadow-2xl overflow-hidden">
      <CardContent className="p-6 md:p-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <div className="col-span-full border-b border-border/10 pb-4 mb-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-primary italic">Meta (Facebook) Tracking</h3>
            </div>
            <FormInput
              label="Facebook Pixel ID"
              name="fbPixelId"
              register={() => ({})}
              value={formData.fbPixelId}
              onChange={(e) => setFormData({...formData, fbPixelId: e.target.value})}
              errors={{}}
            />
            <FormInput
              label="Facebook Access Token (CAPI)"
              name="fbAccessToken"
              register={() => ({})}
              value={formData.fbAccessToken}
              onChange={(e) => setFormData({...formData, fbAccessToken: e.target.value})}
              errors={{}}
            />
            <FormInput
              label="Test Event Code"
              name="fbTestEventCode"
              register={() => ({})}
              value={formData.fbTestEventCode}
              onChange={(e) => setFormData({...formData, fbTestEventCode: e.target.value})}
              errors={{}}
            />

            <div className="col-span-full border-b border-border/10 pb-4 mt-8 mb-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-primary italic">Google Analytics & GTM</h3>
            </div>
            <FormInput
              label="GTM ID"
              name="gtmId"
              register={() => ({})}
              value={formData.gtmId}
              onChange={(e) => setFormData({...formData, gtmId: e.target.value})}
              errors={{}}
            />
            <FormInput
              label="Google Ads ID"
              name="googleAdsId"
              register={() => ({})}
              value={formData.googleAdsId}
              onChange={(e) => setFormData({...formData, googleAdsId: e.target.value})}
              errors={{}}
            />

            <div className="col-span-full border-b border-border/10 pb-4 mt-8 mb-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-primary italic">Other Platforms</h3>
            </div>
            <FormInput
              label="TikTok Pixel ID"
              name="tiktokPixelId"
              register={() => ({})}
              value={formData.tiktokPixelId}
              onChange={(e) => setFormData({...formData, tiktokPixelId: e.target.value})}
              errors={{}}
            />
            <FormInput
              label="TikTok Access Token"
              name="tiktokAccessToken"
              register={() => ({})}
              value={formData.tiktokAccessToken}
              onChange={(e) => setFormData({...formData, tiktokAccessToken: e.target.value})}
              errors={{}}
            />
            <FormInput
              label="Snapchat Pixel ID"
              name="snapPixelId"
              register={() => ({})}
              value={formData.snapPixelId}
              onChange={(e) => setFormData({...formData, snapPixelId: e.target.value})}
              errors={{}}
            />
            <FormInput
              label="Microsoft Clarity ID"
              name="clarityId"
              register={() => ({})}
              value={formData.clarityId}
              onChange={(e) => setFormData({...formData, clarityId: e.target.value})}
              errors={{}}
            />
          </div>

          <div className="pt-12 border-t border-border/5 flex justify-end">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-foreground text-background hover:bg-accent-secondary hover:text-white px-10 h-14 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl transition-all active:scale-95 group"
            >
              <Save size={16} className={cn("mr-2", loading && "animate-pulse")} />
              {loading ? "Updating Marketing..." : "Save Marketing Keys"}
            </Button>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
