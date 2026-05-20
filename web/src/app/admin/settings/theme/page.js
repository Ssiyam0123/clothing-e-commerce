"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { useSettings } from "@/app/admin/settings/lib/useSettings";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ThemePage() {
  const { settings, isLoading, updateSettings, isUpdating } = useSettings();
  const [formData, setFormData] = useState({
    defaultThemeColor: "Zinc",
    defaultThemeFont: "Inter",
    activeTheme: "executive",
  });

  // Sync state with React Query cache instantly on load/update
  useEffect(() => {
    if (settings?.branding) {
      setFormData({
        defaultThemeColor: settings.branding.defaultThemeColor || "Zinc",
        defaultThemeFont: settings.branding.defaultThemeFont || "Inter",
        activeTheme: settings.branding.activeTheme || "executive",
      });
    }
  }, [settings]);

  const handleSave = async () => {
    // Branding update includes theme settings
    const updatedBranding = { ...settings?.branding, ...formData };
    
    const payload = new FormData();
    payload.append("branding", JSON.stringify(updatedBranding));

    await updateSettings(payload);
  };

  if (isLoading && !settings) {
    return <div className="animate-pulse h-96 bg-muted rounded-3xl" />;
  }

  return (
    <Card className="rounded-[2rem] md:rounded-[3rem] border-border/10 bg-card/30 backdrop-blur-2xl shadow-2xl overflow-hidden">
      <CardContent className="p-6 md:p-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-16"
        >
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">Theme Colors</h2>
              <p className="text-xs text-muted-foreground mt-1">Pick your brand's main color</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-8">
              {[
                { name: "Zinc", color: "bg-zinc-900 dark:bg-white" },
                { name: "Rose", color: "bg-rose-600" },
                { name: "Blue", color: "bg-blue-600" },
                { name: "Green", color: "bg-emerald-500" },
                { name: "Orange", color: "bg-orange-500" },
                { name: "Amethyst", color: "bg-purple-500" },
                { name: "Teal", color: "bg-teal-500" },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => setFormData({ ...formData, defaultThemeColor: item.name })}
                  className="group flex flex-col items-center gap-4 transition-all"
                  type="button"
                >
                  <div className={cn(
                    "w-16 h-16 rounded-full shadow-2xl transition-all flex items-center justify-center relative",
                    item.color,
                    formData.defaultThemeColor === item.name ? "ring-4 ring-offset-4 ring-foreground" : "scale-90 opacity-40 hover:opacity-100 hover:scale-100"
                  )}>
                    {formData.defaultThemeColor === item.name && (
                      <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
                    )}
                  </div>
                  <span className={cn(
                    "text-xs font-semibold transition-colors",
                    formData.defaultThemeColor === item.name ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-6 pt-16 border-t border-border/5">
            <div>
              <h2 className="text-lg font-bold text-foreground">Text Fonts</h2>
              <p className="text-xs text-muted-foreground mt-1">Choose the main font for your site</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {[
                "Inter", "Roboto", "Outfit", "Playfair Display",
                "Montserrat", "Space Grotesk", "Poppins", "Syncopate"
              ].map((font) => (
                <button
                  key={font}
                  onClick={() => setFormData({ ...formData, defaultThemeFont: font })}
                  className={cn(
                    "group relative p-6 rounded-3xl border-2 transition-all duration-500 text-left",
                    formData.defaultThemeFont === font
                      ? "border-accent-secondary bg-accent-secondary/5 shadow-2xl"
                      : "border-border/5 hover:border-border/20 bg-muted/20"
                  )}
                  type="button"
                >
                  <div className="flex flex-col gap-4">
                    <span className="text-2xl font-black italic tracking-tighter" style={{ fontFamily: font }}>Aa</span>
                    <span className="text-xs font-semibold opacity-60">{font}</span>
                  </div>
                  {formData.defaultThemeFont === font && (
                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-accent-secondary animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-6 pt-16 border-t border-border/5">
            <div>
              <h2 className="text-lg font-bold text-foreground">Design Preset</h2>
              <p className="text-xs text-muted-foreground mt-1">Pick a visual style for your store</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
              {["executive", "streetwear", "earth", "luxury", "cyber"].map((theme) => (
                <button
                  key={theme}
                  onClick={() => setFormData({ ...formData, activeTheme: theme })}
                  className={cn(
                    "group relative p-6 rounded-3xl border-2 transition-all duration-500",
                    formData.activeTheme === theme
                      ? "border-accent-secondary bg-accent-secondary/5 shadow-2xl"
                      : "border-border/5 hover:border-border/20 bg-muted/20"
                  )}
                  type="button"
                >
                  <span className="text-xs font-semibold opacity-60 group-hover:opacity-100 transition-opacity">
                    {theme}
                  </span>
                  {formData.activeTheme === theme && (
                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-accent-secondary animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </section>

          <div className="pt-16 border-t border-border/5 flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isUpdating}
              className="bg-foreground text-background hover:bg-accent-secondary hover:text-white px-10 h-14 rounded-2xl font-bold text-xs shadow-xl transition-all active:scale-95 group"
            >
              <Save size={16} className={cn("mr-2", isUpdating && "animate-pulse")} />
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
