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
  HardDrive,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Power,
  Menu,
  Mail,
  Palette,
} from "lucide-react";
import { getImageUrl } from "@/utils/imageUtils";

// shadcn/ui components
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const TABS = [
  { id: "branding", label: "Branding", icon: Globe },
  { id: "theme", label: "Theme", icon: Palette },
  { id: "socials", label: "Social Links", icon: Share2 },
  { id: "contact", label: "Contact", icon: Mail },
];

const IDENTITY_THEME_OPTIONS = [
  { value: "executive", label: "Executive (Minimalist & Clean)" },
  { value: "streetwear", label: "Streetwear (Bold & Edgy)" },
  { value: "luxury", label: "Luxury (Elegant & Gold)" },
  { value: "earth", label: "Earth (Natural & Organic)" },
  { value: "cyber", label: "Cyber (Modern & Tech)" },
];

const COLOR_MODE_OPTIONS = [
  { value: "light", label: "Always Light Mode" },
  { value: "dark", label: "Always Dark Mode" },
  { value: "system", label: "Follow System (Auto)" },
];

const LANGUAGE_OPTIONS = [
  { value: "en", label: "English (UK/US)" },
  { value: "bn", label: "Bengali (Bangladesh)" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("branding");
  const [showSecrets, setShowSecrets] = useState(false);

  const { settings, updateSettings, isUpdating } = useSettings();
  const { apiKeys, updateApiKeys, isSyncing } = useApiKeys(activeTab === "api");

  const [formData, setFormData] = useState({
    branding: {},
    socialLinks: [],
    navigation: [],
    contact: {},
    config: {},
    paymentOptions: { cod: true, online: true, bkash: true },
  });

  // Files for upload
  const [files, setFiles] = useState({
    headerLogo: null,
    footerLogo: null,
    favicon: null,
  });
  const [previews, setPreviews] = useState({
    headerLogo: null,
    footerLogo: null,
    favicon: null,
  });

  const [keyData, setKeyData] = useState({
    sslCommerz: {
      storeId: "",
      storePassword: "",
      isLive: false,
      isActive: true,
    },
    bkash: {
      appKey: "",
      appSecret: "",
      userName: "",
      password: "",
      baseURL: "https://tokenized.sandbox.bka.sh/v1.2.0-beta",
      isLive: false,
      isActive: true,
    },
    pathao: {
      clientId: "",
      clientSecret: "",
      userName: "",
      password: "",
      storeId: "",
      baseURL: "https://courier-api-sandbox.pathao.com",
      isActive: true,
    },
    meta: { pixelId: "", accessToken: "", testEventCode: "", isActive: true },
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        branding: settings.branding || {},
        socialLinks: settings.socialLinks || [],
        navigation: settings.navigation || [],
        contact: settings.contact || {},
        config: settings.config || {},
        paymentOptions: settings.paymentOptions || {
          cod: true,
          online: true,
          bkash: true,
        },
      });
    }
  }, [settings]);

  useEffect(() => {
    if (apiKeys) {
      setKeyData({
        sslCommerz: apiKeys.sslCommerz || {
          storeId: "",
          storePassword: "",
          isLive: false,
          isActive: true,
        },
        bkash: apiKeys.bkash || {
          appKey: "",
          appSecret: "",
          userName: "",
          password: "",
          baseURL: "https://tokenized.sandbox.bka.sh/v1.2.0-beta",
          isLive: false,
          isActive: true,
        },
        pathao: apiKeys.pathao || {
          clientId: "",
          clientSecret: "",
          userName: "",
          password: "",
          storeId: "",
          baseURL: "https://courier-api-sandbox.pathao.com",
          isActive: true,
        },
        meta: apiKeys.meta || {
          pixelId: "",
          accessToken: "",
          testEventCode: "",
          isActive: true,
        },
      });
    }
  }, [apiKeys]);

  const handleFileChange = (field, file) => {
    if (file) {
      setFiles((prev) => ({ ...prev, [field]: file }));
      setPreviews((prev) => ({ ...prev, [field]: URL.createObjectURL(file) }));
    }
  };

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
    // Clear local files and previews after successful update
    setFiles({ headerLogo: null, footerLogo: null, favicon: null });
    setPreviews({ headerLogo: null, footerLogo: null, favicon: null });
  };

  const addSocial = () => {
    const newSocial = {
      platform: "New Platform",
      url: "",
      icon: "Facebook",
      isActive: true,
    };
    setFormData({
      ...formData,
      socialLinks: [...(formData.socialLinks || []), newSocial],
    });
  };
  const removeSocial = (index) => {
    const filtered = formData.socialLinks.filter((_, i) => i !== index);
    setFormData({ ...formData, socialLinks: filtered });
  };
  const updateSocial = (index, field, value) => {
    const updated = [...formData.socialLinks];
    updated[index][field] = value;
    setFormData({ ...formData, socialLinks: updated });
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#080808] p-6 lg:p-12 transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase dark:text-white">
              Protocol
            </h1>
            <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-500 mt-2 font-bold">
              Central System Management
            </p>
          </div>
          <Button
            onClick={handleSaveSettings}
            disabled={isUpdating}
            className="rounded-full px-10 py-7 font-black uppercase text-[10px] tracking-widest shadow-2xl transition-all"
          >
            <Save size={14} className="mr-2" />
            {isUpdating ? "Synchronizing..." : "Commit Changes"}
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar Tabs */}
          <nav className="lg:col-span-3 space-y-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${
                  activeTab === tab.id
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-black shadow-xl shadow-zinc-200 dark:shadow-none"
                    : "text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Main Content */}
          <main className="lg:col-span-9 bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-white/5 rounded-[3rem] p-8 md:p-12 shadow-sm">
            <AnimatePresence mode="wait">
              {/* BRANDING */}
              {activeTab === "branding" && (
                <motion.div
                  key="branding"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-12"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <InputField
                      label="Site Primary Name"
                      value={formData.branding?.siteName}
                      onChange={(v) =>
                        setFormData({
                          ...formData,
                          branding: { ...formData.branding, siteName: v },
                        })
                      }
                    />
                    <InputField
                      label="Site Meta Title"
                      value={formData.branding?.siteTitle}
                      onChange={(v) =>
                        setFormData({
                          ...formData,
                          branding: { ...formData.branding, siteTitle: v },
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <InputField
                      label="Site Description / Meta description"
                      value={formData.branding?.description}
                      onChange={(v) =>
                        setFormData({
                          ...formData,
                          branding: { ...formData.branding, description: v },
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-10 border-t dark:border-white/5">
                    <ImageUploadField
                      label="Header Logo"
                      value={formData.branding?.headerLogo}
                      preview={previews.headerLogo}
                      onChange={(f) => handleFileChange("headerLogo", f)}
                    />
                    <ImageUploadField
                      label="Footer Logo"
                      value={formData.branding?.footerLogo}
                      preview={previews.footerLogo}
                      onChange={(f) => handleFileChange("footerLogo", f)}
                    />
                    <ImageUploadField
                      label="Favicon"
                      value={formData.branding?.favicon}
                      preview={previews.favicon}
                      onChange={(f) => handleFileChange("favicon", f)}
                    />
                  </div>
                </motion.div>
              )}

              {/* THEME SETTINGS */}
              {activeTab === "theme" && (
                <motion.div
                  key="theme"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-16"
                >
                  {/* Identity Theme Selection */}
                  <section className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-sm font-black uppercase tracking-widest dark:text-white">
                          Identity Protocol
                        </h2>
                        <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">
                          Select the visual DNA of your storefront
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {IDENTITY_THEME_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setFormData({
                            ...formData,
                            branding: { ...formData.branding, activeTheme: option.value }
                          })}
                          className={`flex flex-col items-start p-6 rounded-2xl border-2 transition-all text-left ${
                            formData.branding?.activeTheme === option.value
                              ? "border-zinc-900 dark:border-white bg-zinc-900 dark:bg-white text-white dark:text-black shadow-xl"
                              : "border-zinc-100 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/20"
                          }`}
                        >
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            {option.label.split(' (')[0]}
                          </span>
                          <span className={`text-[8px] mt-1 ${
                            formData.branding?.activeTheme === option.value ? "opacity-70" : "text-zinc-500"
                          }`}>
                            {option.label.split(' (')[1].replace(')', '')}
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* Color Mode Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-16 border-t dark:border-white/5">
                    <section className="space-y-6">
                      <div>
                        <h2 className="text-sm font-black uppercase tracking-widest dark:text-white">
                          Atmosphere
                        </h2>
                        <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">
                          Default color environment for new visitors
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        {COLOR_MODE_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setFormData({
                              ...formData,
                              branding: { ...formData.branding, defaultTheme: option.value }
                            })}
                            className={`w-full flex items-center justify-between px-6 py-4 rounded-xl border transition-all ${
                              formData.branding?.defaultTheme === option.value
                                ? "border-zinc-900 dark:border-white bg-zinc-50 dark:bg-white/5"
                                : "border-zinc-100 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-white/5"
                            }`}
                          >
                            <span className="text-[9px] font-black uppercase tracking-widest dark:text-white">
                              {option.label}
                            </span>
                            <div className={`w-2 h-2 rounded-full ${
                              formData.branding?.defaultTheme === option.value 
                                ? "bg-zinc-900 dark:bg-white animate-pulse" 
                                : "bg-zinc-200 dark:bg-zinc-800"
                            }`} />
                          </button>
                        ))}
                      </div>
                    </section>

                    {/* Language Selection */}
                    <section className="space-y-6">
                      <div>
                        <h2 className="text-sm font-black uppercase tracking-widest dark:text-white">
                          Localization
                        </h2>
                        <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">
                          System default regional interface
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        {LANGUAGE_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setFormData({
                              ...formData,
                              branding: { ...formData.branding, defaultLanguage: option.value }
                            })}
                            className={`w-full flex items-center justify-between px-6 py-4 rounded-xl border transition-all ${
                              formData.branding?.defaultLanguage === option.value
                                ? "border-zinc-900 dark:border-white bg-zinc-50 dark:bg-white/5"
                                : "border-zinc-100 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-white/5"
                            }`}
                          >
                            <span className="text-[9px] font-black uppercase tracking-widest dark:text-white">
                              {option.label}
                            </span>
                            <div className={`w-2 h-2 rounded-full ${
                              formData.branding?.defaultLanguage === option.value 
                                ? "bg-zinc-900 dark:bg-white animate-pulse" 
                                : "bg-zinc-200 dark:bg-zinc-800"
                            }`} />
                          </button>
                        ))}
                      </div>
                    </section>
                  </div>

                  {/* Primary Color Selection */}
                  <section className="pt-16 border-t dark:border-white/5 space-y-8">
                    <div>
                      <h2 className="text-sm font-black uppercase tracking-widest dark:text-white">
                        Chromatic Brand Identity
                      </h2>
                      <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">
                        Define the primary accent signature of the interface
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-6">
                      {[
                        { name: "Zinc", color: "bg-zinc-900 dark:bg-white" },
                        { name: "Rose", color: "bg-rose-500" },
                        { name: "Blue", color: "bg-blue-600" },
                        { name: "Green", color: "bg-emerald-500" },
                        { name: "Orange", color: "bg-orange-500" },
                      ].map((item) => (
                        <button
                          key={item.name}
                          onClick={() => setFormData({
                            ...formData,
                            branding: { ...formData.branding, defaultThemeColor: item.name }
                          })}
                          className={`group flex flex-col items-center gap-3 transition-all ${
                            formData.branding?.defaultThemeColor === item.name ? "scale-110" : "opacity-60 hover:opacity-100"
                          }`}
                        >
                          <div className={`w-14 h-14 rounded-full ${item.color} shadow-2xl flex items-center justify-center transition-all ${
                            formData.branding?.defaultThemeColor === item.name ? "ring-4 ring-offset-4 ring-zinc-900 dark:ring-white dark:ring-offset-black" : ""
                          }`}>
                            {formData.branding?.defaultThemeColor === item.name && (
                              <div className="w-2 h-2 rounded-full bg-white dark:bg-black animate-ping" />
                            )}
                          </div>
                          <span className="text-[8px] font-black uppercase tracking-widest dark:text-white">
                            {item.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>
                </motion.div>
              )}

              {/* CONTACT */}
              {activeTab === "contact" && (
                <motion.div
                  key="contact"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-12"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <InputField
                      label="Phone Number"
                      value={formData.contact?.phone}
                      onChange={(v) =>
                        setFormData({
                          ...formData,
                          contact: { ...formData.contact, phone: v },
                        })
                      }
                    />
                    <InputField
                      label="Email Address"
                      value={formData.contact?.email}
                      onChange={(v) =>
                        setFormData({
                          ...formData,
                          contact: { ...formData.contact, email: v },
                        })
                      }
                    />
                    <InputField
                      label="WhatsApp Number"
                      value={formData.contact?.whatsapp}
                      onChange={(v) =>
                        setFormData({
                          ...formData,
                          contact: { ...formData.contact, whatsapp: v },
                        })
                      }
                    />
                    <InputField
                      label="Physical Address"
                      value={formData.contact?.address}
                      onChange={(v) =>
                        setFormData({
                          ...formData,
                          contact: { ...formData.contact, address: v },
                        })
                      }
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---
function InputField({ label, value, onChange, type = "text" }) {
  return (
    <div className="space-y-2 w-full">
      <Label className="text-[9px] font-black uppercase text-zinc-400 ml-1 tracking-widest">
        {label}
      </Label>
      <Input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent border-t-0 border-x-0 border-b-2 border-zinc-100 dark:border-white/5 rounded-none px-0 py-3 focus:border-zinc-900 dark:focus:border-white focus-visible:ring-0 font-bold text-xs transition-all dark:text-white h-auto"
      />
    </div>
  );
}

function ToggleField({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between w-full pt-2">
      <span className="text-[9px] font-black uppercase text-zinc-400">
        {label}
      </span>
      <button
        onClick={() => onChange(!value)}
        className={`w-12 h-6 rounded-full transition-all relative ${value ? "bg-zinc-900 dark:bg-white" : "bg-zinc-200 dark:bg-zinc-800"}`}
      >
        <div
          className={`absolute top-1 w-4 h-4 rounded-full transition-all ${value ? "right-1 bg-white dark:bg-black" : "left-1 bg-white dark:bg-zinc-500"}`}
        />
      </button>
    </div>
  );
}

function ServiceSection({ title, isActive, onToggle, children }) {
  return (
    <div
      className={`space-y-8 p-8 rounded-[2.5rem] border transition-all ${isActive ? "border-indigo-500/30 bg-indigo-50/5" : "border-zinc-100 dark:border-white/5 opacity-50 grayscale"}`}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] dark:text-white">
          {title}
        </h3>
        <button
          onClick={onToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase transition-all ${isActive ? "bg-indigo-500 text-white" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"}`}
        >
          <Power size={12} /> {isActive ? "Active" : "Offline"}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">{children}</div>
    </div>
  );
}

function ToggleButton({ isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-14 h-8 rounded-full transition-all relative ${isActive ? "bg-zinc-900 dark:bg-white" : "bg-zinc-200 dark:bg-zinc-800"}`}
    >
      <div
        className={`absolute top-1 w-6 h-6 rounded-full transition-all ${isActive ? "right-1 bg-white dark:bg-black" : "left-1 bg-white dark:bg-zinc-500"}`}
      />
    </button>
  );
}

function ToggleRow({ label, description, isActive, onToggle }) {
  return (
    <div className="flex items-center justify-between p-6 bg-zinc-50 dark:bg-black/20 rounded-2xl border border-zinc-100 dark:border-white/5">
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest dark:text-white">
          {label}
        </p>
        <p className="text-[9px] text-zinc-500 mt-1">{description}</p>
      </div>
      <ToggleButton isActive={isActive} onClick={onToggle} />
    </div>
  );
}

function ImageUploadField({ label, value, preview, onChange }) {
  return (
    <div className="space-y-4">
      <Label className="text-[9px] font-black uppercase text-zinc-400">
        {label}
      </Label>
      <div className="aspect-square bg-zinc-50 dark:bg-black/40 rounded-[2rem] border border-dashed border-zinc-200 dark:border-white/10 flex flex-col items-center justify-center overflow-hidden relative group">
        {preview || value ? (
          <img
            src={preview || getImageUrl(value)}
            className="w-full h-full object-contain p-4 transition-transform group-hover:scale-110"
            alt="preview"
          />
        ) : (
          <span className="text-[8px] font-black uppercase text-zinc-400">
            Empty Asset
          </span>
        )}
      </div>
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => onChange(e.target.files[0])}
        className="text-[10px] bg-zinc-50 dark:bg-black/20 border-zinc-100 dark:border-white/5 rounded-xl h-auto"
      />
    </div>
  );
}
