"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAppStore } from "@/store/appStore";
import { revalidateSettings } from "@/app/actions/revalidate";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormInput from "@/modules/admin/components/FormInput";
import ImageUpload from "@/modules/admin/components/ImageUpload";
import { cn } from "@/lib/utils";

export default function BrandingPage() {
  const { initApp } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState({
    siteName: "",
    siteTitle: "",
    description: "",
    logo: "",
    logoDark: "",
    favicon: "",
  });

  const [files, setFiles] = useState({
    logo: null,
    logoDark: null,
    favicon: null,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get("/settings");
        if (data?.branding) {
          setFormData(data.branding);
        }
      } catch (error) {
        toast.error("Failed to load branding settings.");
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
      payload.append("branding", JSON.stringify(formData));
      if (files.logo) payload.append("logo", files.logo);
      if (files.logoDark) payload.append("logoDark", files.logoDark);
      if (files.favicon) payload.append("favicon", files.favicon);

      await api.put("/settings", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Branding settings updated!");
      await initApp();
      await revalidateSettings();
    } catch (error) {
      toast.error("Failed to update branding settings.");
    } finally {
      setLoading(false);
    }
  };

  if (isFetching) return <div className="animate-pulse space-y-8"><div className="h-40 bg-muted rounded-3xl" /></div>;

  return (
    <Card className="rounded-[2rem] md:rounded-[3rem] border-border/10 bg-card/30 backdrop-blur-2xl shadow-2xl overflow-hidden">
      <CardContent className="p-6 md:p-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <FormInput
              label="Website Name"
              name="siteName"
              register={() => ({})}
              value={formData.siteName}
              onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
              errors={{}}
              placeholder="e.g. Vanguard Store"
            />
            <FormInput
              label="Page Title"
              name="siteTitle"
              register={() => ({})}
              value={formData.siteTitle}
              onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
              errors={{}}
              placeholder="e.g. Premium Clothing"
            />
          </div>

          <FormInput
            label="Site Description"
            name="description"
            register={() => ({})}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            errors={{}}
            placeholder="Enter a short description about your shop..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pt-12 border-t border-border/5">
            <ImageUpload
              label="Primary Logo"
              name="logo"
              register={() => ({})}
              currentImage={formData.logo}
              onImageChange={(f) => setFiles({ ...files, logo: f })}
            />
            <ImageUpload
              label="Logo (Dark Mode)"
              name="logoDark"
              register={() => ({})}
              currentImage={formData.logoDark}
              onImageChange={(f) => setFiles({ ...files, logoDark: f })}
            />
            <ImageUpload
              label="Favicon"
              name="favicon"
              register={() => ({})}
              currentImage={formData.favicon}
              onImageChange={(f) => setFiles({ ...files, favicon: f })}
            />
          </div>

          <div className="pt-12 border-t border-border/5 flex justify-end">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-foreground text-background hover:bg-accent-secondary hover:text-white px-10 h-14 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl transition-all active:scale-95 group"
            >
              <Save size={16} className={cn("mr-2", loading && "animate-pulse")} />
              {loading ? "Updating Identity..." : "Save Identity"}
            </Button>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
