"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Globe,
  Share2,
  Mail,
  Palette,
  ArrowLeft,
  Settings2,
  Cpu
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAppStore } from "@/store/appStore";

// Vanguard UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FormInput from "@/components/admin/FormInput";
import ImageUpload from "@/components/admin/ImageUpload";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const router = useRouter();
  const { initApp } = useAppStore();
  const [activeTab, setActiveTab] = useState("branding");
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const tabs = [
    { id: "branding", label: "Branding", desc: "Identity & Logos", icon: Globe },
    { id: "theme", label: "Theme", desc: "Visual Signature", icon: Palette },
    { id: "socials", label: "Social Links", desc: "Neural Networks", icon: Share2 },
    { id: "contact", label: "Contact", desc: "Comms Channels", icon: Mail },
  ];

  const [formData, setFormData] = useState({
    branding: {
      siteName: "",
      description: "",
      headerLogo: "",
      footerLogo: "",
      favicon: "",
      defaultThemeColor: "Zinc",
      defaultThemeFont: "Inter",
      activeTheme: "executive",
    },
    socialLinks: [],
    contact: {
      phone: "",
      email: "",
      address: "",
    },
  });

  const [files, setFiles] = useState({
    headerLogo: null,
    footerLogo: null,
    favicon: null,
  });

  // 📡 Fetch Settings on Mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get("/settings");
        if (data) {
          setFormData({
            branding: { ...formData.branding, ...data.branding },
            socialLinks: data.socialLinks || [],
            contact: { ...formData.contact, ...data.contact },
          });
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
        toast.error("Protocol Sync Error: Failed to load core settings.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      
      // Append JSON strings for nested objects
      payload.append("branding", JSON.stringify(formData.branding));
      payload.append("socialLinks", JSON.stringify(formData.socialLinks));
      payload.append("contact", JSON.stringify(formData.contact));

      // Append Files
      if (files.headerLogo) payload.append("headerLogo", files.headerLogo);
      if (files.footerLogo) payload.append("footerLogo", files.footerLogo);
      if (files.favicon) payload.append("favicon", files.favicon);

      await api.put("/settings", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Identity Matrix Updated Successfully");
      
      // 🚀 Sync Global Store
      await initApp();
      
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Command Execution Failed: Identity sync interrupted.");
    } finally {
      setLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foreground"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24 px-4 sm:px-6 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 🔙 Back Navigation */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => router.push("/admin")}
          className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-all p-0 hover:bg-transparent"
        >
          <div className="w-8 h-8 rounded-full border border-border/10 flex items-center justify-center group-hover:border-foreground/20 transition-colors">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          </div>
          Back to Dashboard
        </Button>

        <div className="flex items-center gap-4">
           <Badge variant="outline" className="text-[9px] uppercase tracking-widest border-border/20 text-muted-foreground bg-accent/5 px-3 py-1">Secure Protocol</Badge>
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* 🛰️ Tactical Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 bg-card/30 p-10 rounded-[3rem] border border-border/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-600/5 blur-[100px] rounded-full -mr-20 -mt-20 group-hover:bg-zinc-600/10 transition-colors duration-1000" />
        
        <div className="space-y-4 relative z-10">
          <h1 className="text-5xl sm:text-6xl font-black uppercase tracking-tighter dark:text-white italic leading-none">
            Global <span className="text-muted-foreground">Parameters</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground flex items-center gap-3">
            <Cpu size={12} className="text-foreground" /> Config Core • Identity & Aesthetics
          </p>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-foreground text-background hover:bg-rose-600 hover:text-white h-16 px-10 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 group relative z-10"
        >
          <Save size={18} className={cn("mr-3", loading && "animate-pulse")} />
          {loading ? "Syncing..." : "Apply Changes"}
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* 📟 Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-3">
          <div className="p-6 mb-4">
            <p className="text-[8px] font-black uppercase tracking-[0.5em] text-muted-foreground opacity-50">Configuration Matrix</p>
          </div>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "settings-sidebar-item",
                activeTab === tab.id
                  ? "settings-sidebar-item-active"
                  : "settings-sidebar-item-inactive"
              )}
            >
              <div className="flex items-center gap-4 relative z-10 mb-1">
                <tab.icon size={18} className={cn(activeTab === tab.id ? "text-background" : "text-foreground/50")} />
                <span className="font-black uppercase text-[11px] tracking-[0.2em]">{tab.label}</span>
              </div>
              <p className={cn(
                "text-[9px] uppercase tracking-widest opacity-60 ml-8",
                activeTab === tab.id ? "text-background/70" : "text-muted-foreground"
              )}>
                {tab.desc}
              </p>
              {activeTab === tab.id && (
                <motion.div layoutId="tab-indicator" className="absolute inset-0 bg-gradient-to-r from-rose-600/0 via-rose-600/20 to-rose-600/0 opacity-50" />
              )}
            </button>
          ))}
        </aside>

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

                {activeTab === "socials" && (
                  <motion.div
                    key="socials"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      {[
                        { id: "facebook", label: "Facebook Matrix", placeholder: "https://facebook.com/vanguard" },
                        { id: "instagram", label: "Instagram Visuals", placeholder: "https://instagram.com/vanguard" },
                        { id: "twitter", label: "Twitter Comms", placeholder: "https://twitter.com/vanguard" },
                        { id: "linkedin", label: "LinkedIn Network", placeholder: "https://linkedin.com/company/vanguard" },
                      ].map((platform) => (
                        <FormInput
                          key={platform.id}
                          label={platform.label}
                          name={platform.id}
                          register={() => ({ 
                            value: formData.socialLinks?.find(s => s.platform === platform.id)?.url || "", 
                            onChange: (e) => {
                              const newLinks = [...(formData.socialLinks || [])];
                              const index = newLinks.findIndex(s => s.platform === platform.id);
                              if (index > -1) {
                                newLinks[index].url = e.target.value;
                              } else {
                                newLinks.push({ platform: platform.id, url: e.target.value });
                              }
                              setFormData({...formData, socialLinks: newLinks});
                            }
                          })}
                          errors={{}}
                          value={formData.socialLinks?.find(s => s.platform === platform.id)?.url || ""}
                          placeholder={platform.placeholder}
                        />
                      ))}
                    </div>
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
