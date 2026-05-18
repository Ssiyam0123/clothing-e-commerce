"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormInput from "@/app/admin/_components/FormInput";
import { cn } from "@/lib/utils";

export default function SMTPPage() {
  const { settings, isLoading, updateSettings, isUpdating } = useSettings();
  const [formData, setFormData] = useState({
    mailHost: "",
    mailPort: "",
    mailUser: "",
    mailPass: "",
    mailFrom: "",
  });

  // Sync state with React Query cache instantly on load/update
  useEffect(() => {
    if (settings?.smtp) {
      setFormData({
        mailHost: settings.smtp.mailHost || "",
        mailPort: settings.smtp.mailPort || "",
        mailUser: settings.smtp.mailUser || "",
        mailPass: settings.smtp.mailPass || "",
        mailFrom: settings.smtp.mailFrom || "",
      });
    }
  }, [settings]);

  const handleSave = async () => {
    const payload = new FormData();
    payload.append("smtp", JSON.stringify(formData));
    await updateSettings(payload);
  };

  if (isLoading && !settings) return <div className="animate-pulse h-96 bg-muted rounded-3xl" />;

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
              label="SMTP Host"
              name="mailHost"
              register={() => ({})}
              value={formData.mailHost}
              onChange={(e) => setFormData({...formData, mailHost: e.target.value})}
              errors={{}}
              placeholder="e.g. smtp.gmail.com"
            />
            <FormInput
              label="SMTP Port"
              name="mailPort"
              register={() => ({})}
              value={formData.mailPort}
              onChange={(e) => setFormData({...formData, mailPort: e.target.value})}
              errors={{}}
              placeholder="e.g. 587"
            />
            <FormInput
              label="SMTP User / Email"
              name="mailUser"
              register={() => ({})}
              value={formData.mailUser}
              onChange={(e) => setFormData({...formData, mailUser: e.target.value})}
              errors={{}}
              placeholder="e.g. info@yourstore.com"
            />
            <FormInput
              label="SMTP Password / App Pass"
              name="mailPass"
              register={() => ({})}
              value={formData.mailPass}
              onChange={(e) => setFormData({...formData, mailPass: e.target.value})}
              errors={{}}
              placeholder="SMTP Password"
            />
            <FormInput
              label="Mail From Name"
              name="mailFrom"
              register={() => ({})}
              value={formData.mailFrom}
              onChange={(e) => setFormData({...formData, mailFrom: e.target.value})}
              errors={{}}
              placeholder="e.g. Vanguard Store"
            />
          </div>

          <div className="pt-12 border-t border-border/5 flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isUpdating}
              className="bg-foreground text-background hover:bg-accent-secondary hover:text-white px-10 h-14 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl transition-all active:scale-95 group"
            >
              <Save size={16} className={cn("mr-2", isUpdating && "animate-pulse")} />
              {isUpdating ? "Updating Email..." : "Save Email Config"}
            </Button>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
