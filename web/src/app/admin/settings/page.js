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
import { useTheme } from "@/hooks/useTheme";
import { revalidateSettings } from "@/app/actions/revalidate";

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
  useTheme();
  const [activeTab, setActiveTab] = useState("branding");
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const tabs = [
    { id: "branding", label: "Identity", desc: "Logos & Names", icon: Globe },
    { id: "theme", label: "Style", desc: "Colors & Fonts", icon: Palette },
    { id: "socials", label: "Social", desc: "Social Media Links", icon: Share2 },
    { id: "contact", label: "Support", desc: "Contact Details", icon: Mail },
    { id: "payment", label: "Payments", desc: "Payment Methods", icon: Settings2 },
  ];

  const [formData, setFormData] = useState({
    branding: {
      siteName: "",
      siteTitle: "",
      description: "",
      logo: "",
      logoDark: "",
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
      whatsapp: "",
    },
    paymentOptions: {
      cod: true,
      online: true,
      bkash: true,
    }
  });

  const [files, setFiles] = useState({
    logo: null,
    logoDark: null,
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
            paymentOptions: { ...formData.paymentOptions, ...data.paymentOptions },
          });
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
        toast.error("Error: Failed to load settings.");
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
      // Clean social links: Only keep recognized platforms and valid URLs
      const allowedPlatforms = ["facebook", "instagram", "twitter", "linkedin", "tiktok"];
      const cleanedSocialLinks = (formData.socialLinks || []).filter(link => 
        allowedPlatforms.includes(link.platform?.toLowerCase()) && link.url?.trim() !== ""
      );

      payload.append("branding", JSON.stringify(formData.branding));
      payload.append("socialLinks", JSON.stringify(cleanedSocialLinks));
      payload.append("contact", JSON.stringify(formData.contact));
      payload.append("paymentOptions", JSON.stringify(formData.paymentOptions));

      // Append Files
      if (files.logo) payload.append("logo", files.logo);
      if (files.logoDark) payload.append("logoDark", files.logoDark);
      if (files.favicon) payload.append("favicon", files.favicon);

      await api.put("/settings", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Settings Updated Successfully");
      
      // 🚀 Sync Global Store & Revalidate SSR Cache
      await initApp();
      await revalidateSettings();
      
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Update failed. Please try again.");
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
    <div className="admin-page-container">
      <div className="mb-8" />

      {/* 🛰️ Tactical Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 bg-card/30 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-border/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-600/5 blur-[100px] rounded-full -mr-20 -mt-20 group-hover:bg-zinc-600/10 transition-colors duration-1000" />
        
        <div className="space-y-3 md:space-y-4 relative z-10">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter dark:text-white italic leading-none">
            Site <span className="text-muted-foreground">Settings</span>
          </h1>
          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground flex items-center gap-3">
            Website Branding & Support
          </p>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-foreground text-background hover:bg-accent-secondary hover:text-white h-12 md:h-16 px-8 md:px-10 rounded-xl md:rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 group relative z-10 w-full md:w-auto"
        >
          <Save size={18} className={cn("mr-3", loading && "animate-pulse")} />
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </header>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 md:gap-12">
        {/* 📟 Navigation Tabs (Responsive) */}
        <aside className="lg:col-span-3">
          <div className="hidden lg:block p-6 mb-4">
            <p className="text-[8px] font-black uppercase tracking-[0.5em] text-muted-foreground opacity-50">Settings Menu</p>
          </div>
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar gap-2 pb-4 lg:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "settings-sidebar-item shrink-0 lg:shrink",
                  activeTab === tab.id
                    ? "settings-sidebar-item-active"
                    : "settings-sidebar-item-inactive"
                )}
              >
                <div className="flex items-center gap-4 relative z-10 mb-1">
                  <tab.icon size={16} className={cn(activeTab === tab.id ? "text-background" : "text-foreground/50")} />
                  <span className="font-black uppercase text-[10px] md:text-[11px] tracking-[0.2em] whitespace-nowrap">{tab.label}</span>
                </div>
                <p className={cn(
                  "hidden lg:block text-[9px] uppercase tracking-widest opacity-60 ml-8",
                  activeTab === tab.id ? "text-background/70" : "text-muted-foreground"
                )}>
                  {tab.desc}
                </p>
                {activeTab === tab.id && (
                  <motion.div layoutId="tab-indicator" className="absolute inset-0 bg-gradient-to-r from-accent-secondary/0 via-accent-secondary/20 to-accent-secondary/0 opacity-50" />
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* 🖥️ Command Console */}
        <main className="lg:col-span-9">
          <Card className="rounded-[2rem] md:rounded-[3rem] border-border/10 bg-card/30 backdrop-blur-2xl shadow-2xl overflow-hidden min-h-[400px] md:min-h-[600px]">
            <CardContent className="p-6 md:p-16">
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
                        label="Website Name"
                        name="siteName"
                        register={(n) => ({ value: formData.branding?.siteName, onChange: (e) => setFormData({...formData, branding: {...formData.branding, siteName: e.target.value}}) })}
                        errors={{}}
                        value={formData.branding?.siteName}
                        placeholder="e.g. Vanguard Store"
                      />
                      <FormInput
                        label="Page Title"
                        name="siteTitle"
                        register={(n) => ({ value: formData.branding?.siteTitle, onChange: (e) => setFormData({...formData, branding: {...formData.branding, siteTitle: e.target.value}}) })}
                        errors={{}}
                        value={formData.branding?.siteTitle}
                        placeholder="e.g. Premium Clothing"
                      />
                    </div>

                    <FormInput
                      label="Site Description"
                      name="description"
                      register={(n) => ({ value: formData.branding?.description, onChange: (e) => setFormData({...formData, branding: {...formData.branding, description: e.target.value}}) })}
                      errors={{}}
                      value={formData.branding?.description}
                      placeholder="Enter a short description about your shop..."
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pt-12 border-t border-border/5">
                      <ImageUpload
                        label="Primary Logo"
                        name="logo"
                        register={() => ({})}
                        currentImage={formData.branding?.logo}
                        onImageChange={(f) => setFiles({ ...files, logo: f })}
                      />
                      <ImageUpload
                        label="Logo (Dark Mode)"
                        name="logoDark"
                        register={() => ({})}
                        currentImage={formData.branding?.logoDark}
                        onImageChange={(f) => setFiles({ ...files, logoDark: f })}
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
                        <h2 className="text-xl font-black uppercase tracking-tighter italic">Theme Colors</h2>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-2">Pick your brand's main color</p>
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

                    <section className="space-y-10 pt-16 border-t border-border/5">
                      <div>
                        <h2 className="text-xl font-black uppercase tracking-tighter italic">Text Fonts</h2>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-2">Choose the main font for your site</p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        {[
                          "Inter",
                          "Roboto",
                          "Outfit",
                          "Playfair Display",
                          "Montserrat",
                          "Space Grotesk",
                          "Poppins",
                          "Syncopate"
                        ].map((font) => (
                          <button
                            key={font}
                            type="button"
                            onClick={() => setFormData({
                              ...formData,
                              branding: { ...formData.branding, defaultThemeFont: font }
                            })}
                            className={cn(
                              "group relative p-6 rounded-3xl border-2 transition-all duration-500 text-left",
                               formData.branding?.defaultThemeFont === font
                                 ? "border-accent-secondary bg-accent-secondary/5 shadow-2xl"
                                 : "border-border/5 hover:border-border/20 bg-muted/20"
                            )}
                          >
                             <div className="flex flex-col gap-4">
                                <span className="text-2xl font-black italic tracking-tighter" style={{ fontFamily: font }}>Aa</span>
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{font}</span>
                             </div>
                             {formData.branding?.defaultThemeFont === font && (
                               <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-accent-secondary animate-pulse" />
                             )}
                          </button>
                        ))}
                      </div>
                    </section>

                    <section className="space-y-10 pt-16 border-t border-border/5">
                      <div>
                        <h2 className="text-xl font-black uppercase tracking-tighter italic">Design Preset</h2>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-2">Pick a visual style for your store</p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                        {[
                          "executive",
                          "streetwear",
                          "earth",
                          "luxury",
                          "cyber",
                        ].map((theme) => (
                          <button
                            key={theme}
                            type="button"
                            onClick={() => setFormData({
                              ...formData,
                              branding: { ...formData.branding, activeTheme: theme }
                            })}
                            className={cn(
                              "group relative p-6 rounded-3xl border-2 transition-all duration-500",
                               formData.branding?.activeTheme === theme
                                 ? "border-accent-secondary bg-accent-secondary/5 shadow-2xl"
                                 : "border-border/5 hover:border-border/20 bg-muted/20"
                            )}
                          >
                             <span className="text-[10px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                               {theme}
                             </span>
                             {formData.branding?.activeTheme === theme && (
                               <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-accent-secondary animate-pulse" />
                             )}
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
                        { id: "facebook", label: "Facebook Link", placeholder: "https://facebook.com/your-page" },
                        { id: "instagram", label: "Instagram Link", placeholder: "https://instagram.com/your-profile" },
                        { id: "twitter", label: "Twitter Link", placeholder: "https://twitter.com/your-profile" },
                        { id: "linkedin", label: "LinkedIn Link", placeholder: "https://linkedin.com/company/your-page" },
                        { id: "tiktok", label: "TikTok Link", placeholder: "https://tiktok.com/@your-profile" },
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
                        label="Phone Number"
                        name="phone"
                        register={(n) => ({ value: formData.contact?.phone, onChange: (e) => setFormData({...formData, contact: {...formData.contact, phone: e.target.value}}) })}
                        errors={{}}
                        value={formData.contact?.phone}
                        placeholder="+880 1234 567890"
                      />
                      <FormInput
                        label="WhatsApp"
                        name="whatsapp"
                        register={(n) => ({ value: formData.contact?.whatsapp, onChange: (e) => setFormData({...formData, contact: {...formData.contact, whatsapp: e.target.value}}) })}
                        errors={{}}
                        value={formData.contact?.whatsapp}
                        placeholder="+880 1234 567890"
                      />
                      <FormInput
                        label="Email Address"
                        name="email"
                        register={(n) => ({ value: formData.contact?.email, onChange: (e) => setFormData({...formData, contact: {...formData.contact, email: e.target.value}}) })}
                        errors={{}}
                        value={formData.contact?.email}
                        placeholder="contact@yourstore.com"
                      />
                      <FormInput
                        label="Store Address"
                        name="address"
                        register={(n) => ({ value: formData.contact?.address, onChange: (e) => setFormData({...formData, contact: {...formData.contact, address: e.target.value}}) })}
                        errors={{}}
                        value={formData.contact?.address}
                        placeholder="e.g. Sector 7, Uttara, Dhaka"
                      />
                    </div>
                  </motion.div>
                )}

                {activeTab === "payment" && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-16"
                  >
                    <section className="space-y-10">
                      <div>
                        <h2 className="text-xl font-black uppercase tracking-tighter italic">Payment Methods</h2>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-2">Turn on or off your payment options</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {[
                          { id: "cod", label: "Cash On Delivery", desc: "Pay when you get product" },
                          { id: "online", label: "Online Payment", desc: "Cards, Mobile Banking" },
                          { id: "bkash", label: "bKash Direct", desc: "Instant mobile payment" },
                        ].map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setFormData({
                              ...formData,
                              paymentOptions: { 
                                ...formData.paymentOptions, 
                                [option.id]: !formData.paymentOptions[option.id] 
                              }
                            })}
                            className={cn(
                              "group relative p-8 rounded-[2.5rem] border-2 transition-all duration-500 text-left overflow-hidden",
                              formData.paymentOptions?.[option.id]
                                ? "border-emerald-500/50 bg-emerald-500/5 shadow-2xl"
                                : "border-border/5 hover:border-border/20 bg-muted/20 opacity-40 hover:opacity-100"
                            )}
                          >
                             <div className="flex flex-col gap-4 relative z-10">
                                <div className={cn(
                                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                                  formData.paymentOptions?.[option.id] ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                                )}>
                                   <Settings2 size={20} />
                                </div>
                                <div>
                                  <h3 className="text-sm font-black uppercase tracking-tight">{option.label}</h3>
                                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">{option.desc}</p>
                                </div>
                             </div>

                             {formData.paymentOptions?.[option.id] && (
                               <div className="absolute top-6 right-6 w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                             )}
                             
                             <div className={cn(
                               "absolute inset-0 bg-gradient-to-br transition-opacity duration-1000",
                               formData.paymentOptions?.[option.id] ? "from-emerald-500/10 via-transparent to-transparent opacity-100" : "opacity-0"
                             )} />
                          </button>
                        ))}
                      </div>
                    </section>
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
