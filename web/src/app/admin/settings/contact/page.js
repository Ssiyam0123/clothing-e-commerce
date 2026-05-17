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

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    address: "",
    whatsapp: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get("/settings");
        if (data?.contact) {
          setFormData(data.contact);
        }
      } catch (error) {
        toast.error("Failed to load contact settings.");
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
      payload.append("contact", JSON.stringify(formData));
      await api.put("/settings", payload);
      toast.success("Support information updated!");
    } catch (error) {
      toast.error("Failed to update support information.");
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
              disabled={loading}
              className="bg-foreground text-background hover:bg-accent-secondary hover:text-white px-10 h-14 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl transition-all active:scale-95 group"
            >
              <Save size={16} className={cn("mr-2", loading && "animate-pulse")} />
              {loading ? "Updating Support..." : "Save Support Info"}
            </Button>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
