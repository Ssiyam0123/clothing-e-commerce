"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { useSettings } from "@/app/admin/settings/lib/useSettings";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormInput from "@/app/admin/_components/FormInput";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  const { settings, isLoading, updateSettings, isUpdating } = useSettings();
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    address: "",
    whatsapp: "",
  });

  // Sync state with React Query cache instantly on load/update
  useEffect(() => {
    if (settings?.contact) {
      setFormData({
        phone: settings.contact.phone || "",
        email: settings.contact.email || "",
        address: settings.contact.address || "",
        whatsapp: settings.contact.whatsapp || "",
      });
    }
  }, [settings]);

  const handleSave = async () => {
    const payload = new FormData();
    payload.append("contact", JSON.stringify(formData));
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
              label="Phone Number"
              name="phone"
              register={() => ({})}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              errors={{}}
              placeholder="+880 1234 567890"
            />
            <FormInput
              label="WhatsApp"
              name="whatsapp"
              register={() => ({})}
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              errors={{}}
              placeholder="+880 1234 567890"
            />
            <FormInput
              label="Email Address"
              name="email"
              register={() => ({})}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              errors={{}}
              placeholder="contact@yourstore.com"
            />
            <FormInput
              label="Store Address"
              name="address"
              register={() => ({})}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              errors={{}}
              placeholder="e.g. Sector 7, Uttara, Dhaka"
            />
          </div>

          <div className="pt-12 border-t border-border/5 flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isUpdating}
              className="bg-foreground text-background hover:bg-accent-secondary hover:text-white px-10 h-14 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl transition-all active:scale-95 group"
            >
              <Save size={16} className={cn("mr-2", isUpdating && "animate-pulse")} />
              {isUpdating ? "Updating Support..." : "Save Support Info"}
            </Button>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
