"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, BrainCircuit, Sparkles, ShieldAlert } from "lucide-react";
import { useSettings } from "@/app/admin/settings/lib/useSettings";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormInput from "@/app/admin/_components/FormInput";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

export default function AiSettingsPage() {
  const { settings, isLoading, updateSettings, isUpdating } = useSettings();
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role?.name === "superadmin";

  const [formData, setFormData] = useState({
    geminiApiKey: "",
  });

  // Sync React Query cache to form state instantly when settings are loaded
  useEffect(() => {
    if (settings?.ai) {
      setFormData({
        geminiApiKey: settings.ai.geminiApiKey || "",
      });
    }
  }, [settings]);

  const handleSave = async () => {
    if (!isSuperAdmin) return;
    const payload = new FormData();
    payload.append("ai", JSON.stringify(formData));
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
          className="space-y-12"
        >
          <div className="space-y-4">
            <span className="text-[10px] font-black text-accent-secondary uppercase tracking-[0.2em] flex items-center gap-2">
              <BrainCircuit size={14} className="text-accent-secondary animate-pulse" /> AI Engine Configuration
            </span>
            <h2 className="text-xl md:text-2xl font-black text-foreground uppercase tracking-tight italic flex items-center gap-2">
              Google Gemini settings <Sparkles size={18} className="text-amber-500 animate-bounce" />
            </h2>
            <p className="text-muted-foreground text-xs font-semibold max-w-2xl leading-relaxed">
              Configure your Google Gemini API key to enable instant, AI-powered generation of SEO metadata, clothing specifications (Fit, Sleeve, Pattern, Collar), and structured FAQ schemas directly in the product editor.
            </p>
          </div>

          {!isSuperAdmin && (
            <div className="flex gap-4 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold items-center leading-relaxed">
              <ShieldAlert size={20} className="flex-shrink-0" />
              <span>
                Security Notice: Only users with the <strong className="underline">superadmin</strong> role have permissions to view, reveal, or modify the AI Engine API credentials.
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
            <FormInput
              label="Google Gemini API Key"
              name="geminiApiKey"
              register={() => ({})}
              value={formData.geminiApiKey}
              onChange={(e) => setFormData({ ...formData, geminiApiKey: e.target.value })}
              errors={{}}
              placeholder={isSuperAdmin ? "AIzaSy..." : "••••••••••••••••••••"}
              disabled={!isSuperAdmin}
            />
          </div>

          <div className="pt-12 border-t border-border/5 flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isUpdating || !isSuperAdmin}
              className="bg-foreground text-background hover:bg-accent-secondary hover:text-white px-10 h-14 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl transition-all active:scale-95 group"
            >
              <Save size={16} className={cn("mr-2", isUpdating && "animate-pulse")} />
              {isUpdating ? "Saving Key..." : "Save AI Key"}
            </Button>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
