"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Key } from "lucide-react";
import { useSettings } from "@/app/admin/settings/lib/useSettings";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormInput from "@/app/admin/_components/FormInput";
import { cn } from "@/lib/utils";

export default function AuthSettingsPage() {
  const { settings, isLoading, updateSettings, isUpdating } = useSettings();
  const [formData, setFormData] = useState({
    googleClientId: "",
    facebookAppId: "",
  });

  // Sync React Query cache to form state instantly when settings loaded/restored
  useEffect(() => {
    if (settings?.auth) {
      setFormData({
        googleClientId: settings.auth.googleClientId || "",
        facebookAppId: settings.auth.facebookAppId || "",
      });
    }
  }, [settings]);

  const handleSave = async () => {
    const payload = new FormData();
    payload.append("auth", JSON.stringify(formData));
    await updateSettings(payload);
  };

  // Only show the skeleton loader on the VERY FIRST mount of settings if nothing is cached yet.
  // When shifting tabs, React Query serves the cache immediately so this is bypassed, ensuring 0ms layout shift!
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
              <Key size={12} /> Secure Key Vault
            </span>
            <h2 className="text-xl md:text-2xl font-black text-foreground uppercase tracking-tight italic">
              Third-Party Authenticator Keys
            </h2>
            <p className="text-muted-foreground text-xs font-semibold max-w-2xl leading-relaxed">
              Define the credential API keys for Google and Facebook login flows. If keys are provided, the respective social login buttons will automatically appear on the customer sign-in/registration forms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
            <FormInput
              label="Google Client ID"
              name="googleClientId"
              register={() => ({})}
              value={formData.googleClientId}
              onChange={(e) => setFormData({ ...formData, googleClientId: e.target.value })}
              errors={{}}
              placeholder="e.g. 123456789-abc.apps.googleusercontent.com"
            />
            <FormInput
              label="Facebook App ID"
              name="facebookAppId"
              register={() => ({})}
              value={formData.facebookAppId}
              onChange={(e) => setFormData({ ...formData, facebookAppId: e.target.value })}
              errors={{}}
              placeholder="e.g. 987654321012345"
            />
          </div>

          <div className="pt-12 border-t border-border/5 flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isUpdating}
              className="bg-foreground text-background hover:bg-accent-secondary hover:text-white px-10 h-14 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl transition-all active:scale-95 group"
            >
              <Save size={16} className={cn("mr-2", isUpdating && "animate-pulse")} />
              {isUpdating ? "Saving Keys..." : "Save Auth Keys"}
            </Button>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
