"use client";

import { useState, useEffect } from "react";
import { useSettings } from "@/hooks/useSettings";
import { useApiKeys } from "@/hooks/useApiKeys";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Globe,
  ShieldCheck,
  Share2,
  Mail,
  Palette,
  Layers,
  Zap,
  Activity,
  Cpu
} from "lucide-react";

// Vanguard UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FormInput from "@/components/admin/FormInput";
import ImageUpload from "@/components/admin/ImageUpload";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "branding", label: "Branding", icon: Globe },
  { id: "theme", label: "Theme", icon: Palette },
  { id: "socials", label: "Social Links", icon: Share2 },
  { id: "contact", label: "Contact", icon: Mail },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("branding");
  const { settings, updateSettings, isUpdating } = useSettings();

  const [formData, setFormData] = useState({
    branding: {},
    socialLinks: [],
    navigation: [],
    contact: {},
    config: {},
    paymentOptions: { cod: true, online: true, bkash: true },
  });

  const [files, setFiles] = useState({
    headerLogo: null,
    footerLogo: null,
    favicon: null,
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        branding: settings.branding || {},
        socialLinks: settings.socialLinks || [],
        navigation: settings.navigation || [],
        contact: settings.contact || {},
        config: settings.config || {},
        paymentOptions: settings.paymentOptions || { cod: true, online: true, bkash: true },
      });
    }
  }, [settings]);

  const handleSaveSettings = async () => {
    const data = new FormData();
    data.append("branding", JSON.stringify(formData.branding));
    data.append("navigation", JSON.stringify(formData.navigation));
    data.append("socialLinks", JSON.stringify(formData.socialLinks));
    data.append("contact", JSON.stringify(formData.contact));
    data.append("config", JSON.stringify(formData.config));
    data.append("paymentOptions", JSON.stringify(formData.paymentOptions));

    if (files.headerLogo) data.append("headerLogo", files.headerLogo);
    if (files.footerLogo) data.append("footerLogo", files.footerLogo);
    if (files.favicon) data.append("favicon", files.favicon);

    await updateSettings(data);
    setFiles({ headerLogo: null, footerLogo: null, favicon: null });
  };

  return (
    <div className="space-y-12 pb-24 px-4 sm:px-6 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 🛰️ Tactical Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 bg-card/30 p-10 rounded-[3rem] border border-border/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-600/5 blur-[100px] rounded-full -mr-20 -mt-20 group-hover:bg-zinc-600/10 transition-colors duration-1000" />
        
        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-3">
             <Badge variant="outline" className="text-[9px] uppercase tracking-widest border-border/20 text-muted-foreground bg-accent/5 px-3 py-1">System Core</Badge>
             <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black opacity-40">// PROTOCOL_v9.4</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-black uppercase tracking-tighter dark:text-white italic leading-none">
            System <span className="text-muted-foreground">Config</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground flex items-center gap-3">
            <Cpu size={12} className="text-foreground animate-pulse" /> Logic Orchestration • Security Level: 01
          </p>
        </div>

        <Button
          onClick={handleSaveSettings}
          disabled={isUpdating}
          className="bg-foreground text-background hover:bg-rose-600 hover:text-white h-16 px-10 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 group relative z-10"
        >
          <Save size={18} className="mr-3 transition-transform group-hover:scale-110" />
          {isUpdating ? "Synchronizing..." : "Commit Protocol"}
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* 📟 Navigation Matrix */}
        <nav className="lg:col-span-3 space-y-3">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center justify-between px-8 py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] transition-all relative overflow-hidden group",
                activeTab === tab.id
                  ? "bg-foreground text-background shadow-2xl shadow-foreground/10"
                  : "bg-card/30 text-muted-foreground hover:bg-card/50 border border-border/5"
              )}
            >
              <div className="flex items-center gap-4 relative z-10">
                <tab.icon size={16} />
                {tab.label}
              </div>
              {activeTab === tab.id && (
                <motion.div layoutId="tab-indicator" className="absolute inset-0 bg-gradient-to-r from-rose-600/0 via-rose-600/10 to-rose-600/0 opacity-50" />
              )}
            </button>
          ))}
        </nav>

        {/* 🖥️ Command Console */}
        <main className="lg:col-span-9">
          <Card className="rounded-[3rem] border-border/10 bg-card/30 backdrop-blur-2xl shadow-2xl overflow-hidden min-h-[600px]">
            <CardContent className="p-10 md:p-16">
              <AnimatePresence mode="wait">
                {activeTab === "branding" && (
                  <motion.div
                    key="branding"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-12"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <FormInput
                        label="Identity Name"
                        name="siteName"
                        register={(n) => ({ value: formData.branding?.siteName, onChange: (e) => setFormData({...formData, branding: {...formData.branding, siteName: e.target.value}}) })}
                        errors={{}}
                        value={formData.branding?.siteName}
                        placeholder="Vanguard Systems"
                      />
                      <FormInput
                        label="Meta Descriptor"
                        name="siteTitle"
                        register={(n) => ({ value: formData.branding?.siteTitle, onChange: (e) => setFormData({...formData, branding: {...formData.branding, siteTitle: e.target.value}}) })}
                        errors={{}}
                        value={formData.branding?.siteTitle}
                        placeholder="Premium Artifacts"
                      />
                    </div>

                    <FormInput
                      label="Neural Description"
                      name="description"
                      register={(n) => ({ value: formData.branding?.description, onChange: (e) => setFormData({...formData, branding: {...formData.branding, description: e.target.value}}) })}
                      errors={{}}
                      value={formData.branding?.description}
                      placeholder="Enter the primary mission statement..."
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-border/5">
                      <ImageUpload
                        label="Header Array"
                        name="headerLogo"
                        register={() => ({})}
                        currentImage={formData.branding?.headerLogo}
                        onImageChange={(f) => setFiles({ ...files, headerLogo: f })}
                      />
                      <ImageUpload
                        label="Footer Array"
                        name="footerLogo"
                        register={() => ({})}
                        currentImage={formData.branding?.footerLogo}
                        onImageChange={(f) => setFiles({ ...files, footerLogo: f })}
                      />
                      <ImageUpload
                        label="Favicon"
                        name="favicon"
                        register={() => ({})}
                        currentImage={formData.branding?.favicon}
                        onImageChange={(f) => setFiles({ ...files, favicon: f })}
                      />
                    </div>
                  </motion.div>
                )}

                {activeTab === "theme" && (
                  <motion.div
                    key="theme"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-16"
                  >
                    <section className="space-y-10">
                      <div>
                        <h2 className="text-xl font-black uppercase tracking-tighter italic">Chromatic Identity</h2>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-2">Define the primary accent signature</p>
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
                            onClick={() => setFormData({ ...formData, branding: { ...formData.branding, defaultThemeColor: item.name }})}
                            className="group flex flex-col items-center gap-4 transition-all"
                          >
                            <div className={cn(
                              "w-16 h-16 rounded-full shadow-2xl transition-all flex items-center justify-center relative",
                              item.color,
                              formData.branding?.defaultThemeColor === item.name ? "ring-4 ring-offset-4 ring-foreground" : "scale-90 opacity-40 hover:opacity-100 hover:scale-100"
                            )}>
                              {formData.branding?.defaultThemeColor === item.name && (
                                <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
                              )}
                            </div>
                            <span className={cn(
                              "text-[9px] font-black uppercase tracking-widest transition-colors",
                              formData.branding?.defaultThemeColor === item.name ? "text-foreground" : "text-muted-foreground"
                            )}>
                              {item.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </section>
                  </motion.div>
                )}

                {activeTab === "contact" && (
                  <motion.div
                    key="contact"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <FormInput
                        label="Comms Channel (Phone)"
                        name="phone"
                        register={(n) => ({ value: formData.contact?.phone, onChange: (e) => setFormData({...formData, contact: {...formData.contact, phone: e.target.value}}) })}
                        errors={{}}
                        value={formData.contact?.phone}
                      />
                      <FormInput
                        label="Transmission (Email)"
                        name="email"
                        register={(n) => ({ value: formData.contact?.email, onChange: (e) => setFormData({...formData, contact: {...formData.contact, email: e.target.value}}) })}
                        errors={{}}
                        value={formData.contact?.email}
                      />
                    </div>
                    <FormInput
                      label="Physical Coordinates"
                      name="address"
                      register={(n) => ({ value: formData.contact?.address, onChange: (e) => setFormData({...formData, contact: {...formData.contact, address: e.target.value}}) })}
                      errors={{}}
                      value={formData.contact?.address}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
