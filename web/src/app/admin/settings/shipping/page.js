"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Truck, Save, Info } from "lucide-react";
import { useSettings } from "@/app/admin/settings/lib/useSettings";
import { clientUpdateSettings } from "@/app/admin/settings/lib/settings";
import { swalToast, swalError } from "@/utils/swal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function ShippingSettingsPage() {
  const { settings, isLoading, refetch } = useSettings();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    insideDhaka: 60,
    outsideDhaka: 120,
  });

  useEffect(() => {
    if (settings?.shipping) {
      setFormData({
        insideDhaka: settings.shipping.insideDhaka || 60,
        outsideDhaka: settings.shipping.outsideDhaka || 120,
      });
    }
  }, [settings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await clientUpdateSettings({
        shipping: formData,
      });
      await refetch();

      swalToast("Shipping protocols updated", "success");
    } catch (error) {
      swalError("Sync Failure", "Could not persist shipping configurations.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-none glass-card overflow-hidden rounded-[2.5rem] shadow-2xl">
          <CardContent className="p-8 sm:p-12 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Truck size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tighter italic">Logistics Rates</h2>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Configure delivery charges</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-2 text-muted-foreground">
                  Inside Dhaka (BDT)
                </Label>
                <Input
                  type="number"
                  value={formData.insideDhaka}
                  onChange={(e) => setFormData({ ...formData, insideDhaka: Number(e.target.value) })}
                  className="h-16 px-8 rounded-2xl bg-background/50 border-none font-black text-xl tracking-tighter focus-visible:ring-2 focus-visible:ring-primary/50 shadow-inner"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-2 text-muted-foreground">
                  Outside Dhaka (BDT)
                </Label>
                <Input
                  type="number"
                  value={formData.outsideDhaka}
                  onChange={(e) => setFormData({ ...formData, outsideDhaka: Number(e.target.value) })}
                  className="h-16 px-8 rounded-2xl bg-background/50 border-none font-black text-xl tracking-tighter focus-visible:ring-2 focus-visible:ring-primary/50 shadow-inner"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-none glass-card rounded-[2.5rem] p-8 sm:p-10 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent-secondary/10 flex items-center justify-center text-accent-secondary shrink-0">
                <Info size={20} />
              </div>
              <div className="space-y-2">
                <h4 className="text-[11px] font-black uppercase tracking-widest">Protocol Intel</h4>
                <p className="text-xs font-bold text-muted-foreground/60 leading-relaxed italic">
                  These rates will be applied globally across the storefront checkout. Changes are synchronized in real-time with the neural checkout engine.
                </p>
              </div>
            </div>
          </Card>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full h-20 rounded-[2.5rem] bg-foreground text-background font-black uppercase tracking-[0.4em] text-xs shadow-2xl hover:bg-primary hover:text-white transition-all group"
          >
            {isSaving ? (
              <div className="w-6 h-6 border-4 border-background border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save size={20} className="mr-3 group-hover:scale-125 transition-transform" />
                Commit Rates
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
