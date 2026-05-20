"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Server, Cloud } from "lucide-react";
import { useSettings } from "@/app/admin/settings/lib/useSettings";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormInput from "@/app/admin/_components/FormInput";
import ImageUpload from "@/app/admin/_components/ImageUpload";
import { cn } from "@/lib/utils";

export default function BrandingPage() {
  const { settings, isLoading, updateSettings, isUpdating } = useSettings();
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

  const [storageMethod, setStorageMethod] = useState("cloudinary");
  const [cloudinaryKeys, setCloudinaryKeys] = useState({
    cloudinaryCloudName: "",
    cloudinaryApiKey: "",
    cloudinaryApiSecret: "",
  });

  // Sync state with React Query cache instantly on mount/update
  useEffect(() => {
    if (settings) {
      if (settings.branding) {
        setFormData({
          siteName: settings.branding.siteName || "",
          siteTitle: settings.branding.siteTitle || "",
          description: settings.branding.description || "",
          logo: settings.branding.logo || "",
          logoDark: settings.branding.logoDark || "",
          favicon: settings.branding.favicon || "",
        });
      }
      if (settings.config?.storageMethod) {
        setStorageMethod(settings.config.storageMethod);
      }
      if (settings.cloudinary) {
        setCloudinaryKeys({
          cloudinaryCloudName: settings.cloudinary.cloudinaryCloudName || "",
          cloudinaryApiKey: settings.cloudinary.cloudinaryApiKey || "",
          cloudinaryApiSecret: settings.cloudinary.cloudinaryApiSecret || "",
        });
      }
    }
  }, [settings]);

  const handleSave = async () => {
    const mergedBranding = {
      ...settings?.branding,
      ...formData
    };

    const payload = new FormData();
    payload.append("branding", JSON.stringify(mergedBranding));

    // Update config storageMethod
    const mergedConfig = {
      ...settings?.config,
      storageMethod: storageMethod
    };
    payload.append("config", JSON.stringify(mergedConfig));

    // Update Cloudinary API keys
    payload.append("cloudinary", JSON.stringify(cloudinaryKeys));

    if (files.logo) payload.append("logo", files.logo);
    if (files.logoDark) payload.append("logoDark", files.logoDark);
    if (files.favicon) payload.append("favicon", files.favicon);

    await updateSettings(payload);
  };

  if (isLoading && !settings) {
    return <div className="animate-pulse space-y-8"><div className="h-40 bg-muted rounded-3xl" /></div>;
  }

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
              onImageChange={(f) => {
                setFiles(prev => ({ ...prev, logo: f }));
                if (!f) setFormData(prev => ({ ...prev, logo: "" }));
              }}
            />
            <ImageUpload
              label="Logo (Dark Mode)"
              name="logoDark"
              register={() => ({})}
              currentImage={formData.logoDark}
              onImageChange={(f) => {
                setFiles(prev => ({ ...prev, logoDark: f }));
                if (!f) setFormData(prev => ({ ...prev, logoDark: "" }));
              }}
            />
            <ImageUpload
              label="Favicon"
              name="favicon"
              register={() => ({})}
              currentImage={formData.favicon}
              onImageChange={(f) => {
                setFiles(prev => ({ ...prev, favicon: f }));
                if (!f) setFormData(prev => ({ ...prev, favicon: "" }));
              }}
            />
          </div>

          <div className="pt-12 border-t border-border/5 space-y-8">
            <div className="space-y-2">
              <h3 className="text-md font-bold text-foreground">Media Storage Strategy</h3>
              <p className="text-xs text-muted-foreground">
                Choose where to store uploaded images (e.g. logos, product photos, banners).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Local Storage Option */}
              <button
                type="button"
                onClick={() => setStorageMethod("server")}
                className={cn(
                  "group relative p-6 rounded-3xl border-2 transition-all duration-500 text-left flex items-start gap-4",
                  storageMethod === "server"
                    ? "border-accent-secondary bg-accent-secondary/5 shadow-2xl"
                    : "border-border/5 hover:border-border/20 bg-muted/20"
                )}
              >
                <div className={cn(
                  "p-3 rounded-xl bg-background border border-border/10 transition-colors",
                  storageMethod === "server" ? "text-accent-secondary" : "text-muted-foreground"
                )}>
                  <Server size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-foreground">Local Server Storage</h4>
                  <p className="text-[10px] text-muted-foreground leading-normal">
                    Save directly to the server's uploads folder. Local images are erased on platforms like Render or Vercel on redeployment.
                  </p>
                </div>
                {storageMethod === "server" && (
                  <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-accent-secondary animate-pulse" />
                )}
              </button>

              {/* Cloudinary Storage Option */}
              <button
                type="button"
                onClick={() => setStorageMethod("cloudinary")}
                className={cn(
                  "group relative p-6 rounded-3xl border-2 transition-all duration-500 text-left flex items-start gap-4",
                  storageMethod === "cloudinary"
                    ? "border-accent-secondary bg-accent-secondary/5 shadow-2xl"
                    : "border-border/5 hover:border-border/20 bg-muted/20"
                )}
              >
                <div className={cn(
                  "p-3 rounded-xl bg-background border border-border/10 transition-colors",
                  storageMethod === "cloudinary" ? "text-accent-secondary" : "text-muted-foreground"
                )}>
                  <Cloud size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-foreground">Cloudinary Storage</h4>
                  <p className="text-[10px] text-muted-foreground leading-normal">
                    Securely upload to Cloudinary. Provides instant page loads, CDN delivery, and automatic compression. Recommended.
                  </p>
                </div>
                {storageMethod === "cloudinary" && (
                  <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-accent-secondary animate-pulse" />
                )}
              </button>
            </div>

            {/* Cloudinary API inputs */}
            {storageMethod === "cloudinary" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4"
              >
                <FormInput
                  label="Cloudinary Cloud Name"
                  name="cloudinaryCloudName"
                  register={() => ({})}
                  value={cloudinaryKeys.cloudinaryCloudName}
                  onChange={(e) =>
                    setCloudinaryKeys({ ...cloudinaryKeys, cloudinaryCloudName: e.target.value })
                  }
                  errors={{}}
                  placeholder="e.g. ds4hwq3hb"
                />
                <FormInput
                  label="Cloudinary API Key"
                  name="cloudinaryApiKey"
                  register={() => ({})}
                  value={cloudinaryKeys.cloudinaryApiKey}
                  onChange={(e) =>
                    setCloudinaryKeys({ ...cloudinaryKeys, cloudinaryApiKey: e.target.value })
                  }
                  errors={{}}
                  placeholder="e.g. 615465272372143"
                />
                <FormInput
                  label="Cloudinary API Secret"
                  name="cloudinaryApiSecret"
                  type="password"
                  register={() => ({})}
                  value={cloudinaryKeys.cloudinaryApiSecret}
                  onChange={(e) =>
                    setCloudinaryKeys({ ...cloudinaryKeys, cloudinaryApiSecret: e.target.value })
                  }
                  errors={{}}
                  placeholder="Enter API Secret"
                />
              </motion.div>
            )}
          </div>

          <div className="pt-12 border-t border-border/5 flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isUpdating}
              className="bg-foreground text-background hover:bg-accent-secondary hover:text-white px-10 h-14 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl transition-all active:scale-95 group"
            >
              <Save size={16} className={cn("mr-2", isUpdating && "animate-pulse")} />
              {isUpdating ? "Updating Identity..." : "Save Identity"}
            </Button>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
