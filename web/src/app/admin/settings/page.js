"use client";

import { useState, useEffect } from "react";
import { useSettings } from "@/hooks/useSettings";
import { useApiKeys } from "@/hooks/useApiKeys";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Globe, ShieldCheck, Share2, HardDrive, Eye, EyeOff, Plus, Trash2, Power } from "lucide-react";

const TABS = [
  { id: 'branding', label: 'Branding', icon: Globe },
  { id: 'socials', label: 'Social Links', icon: Share2 },
  { id: 'api', label: 'API Vault', icon: ShieldCheck },
  { id: 'system', label: 'System', icon: HardDrive },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('branding');
  const [showSecrets, setShowSecrets] = useState(false);
  
  const { settings, updateSettings, isUpdating } = useSettings();
  const { apiKeys, updateApiKeys, isSyncing } = useApiKeys(activeTab === 'api');

  const [formData, setFormData] = useState({
    branding: {},
    socialLinks: [],
    config: {},
    paymentOptions: { cod: true, online: true, bkash: true }
  });
  const [keyData, setKeyData] = useState({
    sslCommerz: { storeId: '', storePassword: '', isLive: false, isActive: true },
    bkash: { appKey: '', appSecret: '', userName: '', password: '', baseURL: 'https://tokenized.sandbox.bka.sh/v1.2.0-beta', isLive: false, isActive: true },
    pathao: { clientId: '', clientSecret: '', userName: '', password: '', storeId: '', baseURL: 'https://courier-api-sandbox.pathao.com', isActive: true },
    meta: { pixelId: '', accessToken: '', testEventCode: '', isActive: true }
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        branding: settings.branding || {},
        socialLinks: settings.socialLinks || [],
        config: settings.config || {},
        paymentOptions: settings.paymentOptions || { cod: true, online: true, bkash: true }
      });
    }
  }, [settings]);

  useEffect(() => {
    if (apiKeys) {
      setKeyData({
        sslCommerz: apiKeys.sslCommerz || { storeId: '', storePassword: '', isLive: false, isActive: true },
        bkash: apiKeys.bkash || { appKey: '', appSecret: '', userName: '', password: '', baseURL: 'https://tokenized.sandbox.bka.sh/v1.2.0-beta', isLive: false, isActive: true },
        pathao: apiKeys.pathao || { clientId: '', clientSecret: '', userName: '', password: '', storeId: '', baseURL: 'https://courier-api-sandbox.pathao.com', isActive: true },
        meta: apiKeys.meta || { pixelId: '', accessToken: '', testEventCode: '', isActive: true }
      });
    }
  }, [apiKeys]);

  // --- Social Links Logic ---
  const addSocial = () => {
    const newSocial = { platform: "New Platform", url: "", icon: "Facebook", isActive: true };
    setFormData({ ...formData, socialLinks: [...(formData.socialLinks || []), newSocial] });
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

  // --- API Vault Logic ---
  const toggleService = (service) => {
    const updatedKeys = { ...keyData };
    updatedKeys[service].isActive = !updatedKeys[service].isActive;
    setKeyData(updatedKeys);
  };

  const handleSaveSettings = async () => {
    await updateSettings(formData);
  };
  const handleSaveKeys = async () => {
    await updateApiKeys(keyData);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#080808] p-6 lg:p-12 transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase dark:text-white">Protocol</h1>
            <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-500 mt-2 font-bold">Central System Management</p>
          </div>
          <button 
            onClick={activeTab === 'api' ? handleSaveKeys : handleSaveSettings}
            disabled={isUpdating || isSyncing}
            className="flex items-center gap-3 bg-zinc-900 dark:bg-white text-white dark:text-black px-10 py-5 rounded-full font-black uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl disabled:opacity-50"
          >
            <Save size={14} />
            {isUpdating || isSyncing ? 'Synchronizing...' : 'Commit Changes'}
          </button>
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
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-black shadow-xl shadow-zinc-200 dark:shadow-none' 
                  : 'text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
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
              {activeTab === 'branding' && (
                <motion.div key="branding" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <InputField label="Site Primary Name" value={formData.branding?.siteName} onChange={(v) => setFormData({...formData, branding: {...formData.branding, siteName: v}})} />
                    <InputField label="Site Meta Title" value={formData.branding?.siteTitle} onChange={(v) => setFormData({...formData, branding: {...formData.branding, siteTitle: v}})} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-10 border-t dark:border-white/5">
                    <ImageUploadField label="Header Logo" value={formData.branding?.headerLogo} />
                    <ImageUploadField label="Footer Logo" value={formData.branding?.footerLogo} />
                    <ImageUploadField label="Favicon" value={formData.branding?.favicon} />
                  </div>
                </motion.div>
              )}

              {/* SOCIAL LINKS */}
              {activeTab === 'socials' && (
                <motion.div key="socials" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Social Connections</h2>
                    <button onClick={addSocial} className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">
                      <Plus size={12} /> Add New
                    </button>
                  </div>
                  <div className="space-y-4">
                    {formData.socialLinks?.map((social, index) => (
                      <div key={index} className="flex flex-col md:flex-row items-center gap-6 p-6 bg-zinc-50 dark:bg-black/20 rounded-[2rem] border border-zinc-100 dark:border-white/5">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                          <InputField label="Platform" value={social.platform} onChange={(v) => updateSocial(index, 'platform', v)} />
                          <InputField label="URL" value={social.url} onChange={(v) => updateSocial(index, 'url', v)} />
                          <InputField label="Icon Name" value={social.icon} onChange={(v) => updateSocial(index, 'icon', v)} />
                        </div>
                        <div className="flex items-center gap-4">
                          <ToggleButton isActive={social.isActive} onClick={() => updateSocial(index, 'isActive', !social.isActive)} />
                          <button onClick={() => removeSocial(index)} className="p-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-full transition-all">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* API VAULT – with complete Pathao and bKash fields */}
              {activeTab === 'api' && (
                <motion.div key="api" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-16">
                  <div className="flex justify-between items-center bg-zinc-900 text-white p-6 rounded-3xl">
                    <div className="flex items-center gap-4">
                      <ShieldCheck className="text-emerald-400" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest">Secret Vault Mode</p>
                        <p className="text-[8px] text-zinc-500 uppercase tracking-tighter">Manage API Keys and Service Toggles</p>
                      </div>
                    </div>
                    <button onClick={() => setShowSecrets(!showSecrets)} className="p-2 hover:bg-white/10 rounded-full transition-all">
                      {showSecrets ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* SSLCommerz */}
                  <ServiceSection title="SSLCommerz Protocol" isActive={keyData.sslCommerz?.isActive} onToggle={() => toggleService('sslCommerz')}>
                    <InputField label="Store ID" type={showSecrets ? 'text' : 'password'} value={keyData.sslCommerz?.storeId} onChange={(v) => setKeyData({...keyData, sslCommerz: {...keyData.sslCommerz, storeId: v}})} />
                    <InputField label="Store Password" type={showSecrets ? 'text' : 'password'} value={keyData.sslCommerz?.storePassword} onChange={(v) => setKeyData({...keyData, sslCommerz: {...keyData.sslCommerz, storePassword: v}})} />
                    <ToggleField label="Live Mode" value={keyData.sslCommerz?.isLive} onChange={(v) => setKeyData({...keyData, sslCommerz: {...keyData.sslCommerz, isLive: v}})} />
                  </ServiceSection>

                  {/* bKash – with baseURL field */}
                  <ServiceSection title="bKash API" isActive={keyData.bkash?.isActive} onToggle={() => toggleService('bkash')}>
                    <InputField label="App Key" type={showSecrets ? 'text' : 'password'} value={keyData.bkash?.appKey} onChange={(v) => setKeyData({...keyData, bkash: {...keyData.bkash, appKey: v}})} />
                    <InputField label="App Secret" type={showSecrets ? 'text' : 'password'} value={keyData.bkash?.appSecret} onChange={(v) => setKeyData({...keyData, bkash: {...keyData.bkash, appSecret: v}})} />
                    <InputField label="Username" type={showSecrets ? 'text' : 'password'} value={keyData.bkash?.userName} onChange={(v) => setKeyData({...keyData, bkash: {...keyData.bkash, userName: v}})} />
                    <InputField label="Password" type={showSecrets ? 'text' : 'password'} value={keyData.bkash?.password} onChange={(v) => setKeyData({...keyData, bkash: {...keyData.bkash, password: v}})} />
                    <InputField label="Base URL" value={keyData.bkash?.baseURL} onChange={(v) => setKeyData({...keyData, bkash: {...keyData.bkash, baseURL: v}})} />
                    <ToggleField label="Live Mode" value={keyData.bkash?.isLive} onChange={(v) => setKeyData({...keyData, bkash: {...keyData.bkash, isLive: v}})} />
                  </ServiceSection>

                  {/* Pathao – with all required fields (clientId, clientSecret, userName, password, storeId, baseURL) */}
                  <ServiceSection title="Pathao Courier" isActive={keyData.pathao?.isActive} onToggle={() => toggleService('pathao')}>
                    <InputField label="Client ID" type={showSecrets ? 'text' : 'password'} value={keyData.pathao?.clientId} onChange={(v) => setKeyData({...keyData, pathao: {...keyData.pathao, clientId: v}})} />
                    <InputField label="Client Secret" type={showSecrets ? 'text' : 'password'} value={keyData.pathao?.clientSecret} onChange={(v) => setKeyData({...keyData, pathao: {...keyData.pathao, clientSecret: v}})} />
                    <InputField label="Username (API User)" type={showSecrets ? 'text' : 'password'} value={keyData.pathao?.userName} onChange={(v) => setKeyData({...keyData, pathao: {...keyData.pathao, userName: v}})} />
                    <InputField label="Password (API Pass)" type={showSecrets ? 'text' : 'password'} value={keyData.pathao?.password} onChange={(v) => setKeyData({...keyData, pathao: {...keyData.pathao, password: v}})} />
                    <InputField label="Store ID" value={keyData.pathao?.storeId} onChange={(v) => setKeyData({...keyData, pathao: {...keyData.pathao, storeId: v}})} />
                    <InputField label="Base URL" value={keyData.pathao?.baseURL} onChange={(v) => setKeyData({...keyData, pathao: {...keyData.pathao, baseURL: v}})} />
                  </ServiceSection>

                  {/* Meta Pixel */}
                  <ServiceSection title="Meta Pixel Tracking" isActive={keyData.meta?.isActive} onToggle={() => toggleService('meta')}>
                    <InputField label="Pixel ID" value={keyData.meta?.pixelId} onChange={(v) => setKeyData({...keyData, meta: {...keyData.meta, pixelId: v}})} />
                    <InputField label="Access Token" type={showSecrets ? 'text' : 'password'} value={keyData.meta?.accessToken} onChange={(v) => setKeyData({...keyData, meta: {...keyData.meta, accessToken: v}})} />
                    <InputField label="Test Event Code" value={keyData.meta?.testEventCode} onChange={(v) => setKeyData({...keyData, meta: {...keyData.meta, testEventCode: v}})} />
                  </ServiceSection>
                </motion.div>
              )}

              {/* SYSTEM – with payment options */}
              {activeTab === 'system' && (
                <motion.div key="system" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-zinc-400">Image Processing Storage</label>
                    <select 
                      value={formData.config?.storageMethod}
                      onChange={(e) => setFormData({...formData, config: {...formData.config, storageMethod: e.target.value}})}
                      className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-100 dark:border-white/5 p-5 rounded-[1.5rem] outline-none font-bold uppercase text-[11px] tracking-widest dark:text-white appearance-none"
                    >
                      <option value="cloudinary">Cloudinary Integration</option>
                      <option value="server">Local High-Speed Storage</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between p-8 rounded-[2.5rem] border-2 border-dashed border-zinc-100 dark:border-white/5">
                    <div>
                      <p className="text-[11px] font-black uppercase dark:text-white">Protocol: Maintenance Mode</p>
                      <p className="text-[9px] text-zinc-500 uppercase mt-1 tracking-widest">Global storefront access restriction</p>
                    </div>
                    <ToggleButton isActive={formData.config?.maintenanceMode} onClick={() => setFormData({...formData, config: {...formData.config, maintenanceMode: !formData.config?.maintenanceMode}})} />
                  </div>

                  {/* Payment Options */}
                  <div className="space-y-6">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Payment Methods</h3>
                    <div className="space-y-4">
                      <ToggleRow label="Cash on Delivery (COD)" description="Allow customers to pay when they receive the order" isActive={formData.paymentOptions?.cod} onToggle={() => setFormData({...formData, paymentOptions: {...formData.paymentOptions, cod: !formData.paymentOptions?.cod}})} />
                      <ToggleRow label="Online Payment (SSLCommerz)" description="Credit cards, internet banking, mobile banking" isActive={formData.paymentOptions?.online} onToggle={() => setFormData({...formData, paymentOptions: {...formData.paymentOptions, online: !formData.paymentOptions?.online}})} />
                      <ToggleRow label="bKash (Direct)" description="Pay using bKash mobile banking" isActive={formData.paymentOptions?.bkash} onToggle={() => setFormData({...formData, paymentOptions: {...formData.paymentOptions, bkash: !formData.paymentOptions?.bkash}})} />
                    </div>
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

// --- Helper Components (unchanged) ---
function InputField({ label, value, onChange, type = "text" }) {
  return (
    <div className="space-y-2 w-full">
      <label className="text-[9px] font-black uppercase text-zinc-400 ml-1 tracking-widest">{label}</label>
      <input 
        type={type}
        value={value || ""} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-b-2 border-zinc-100 dark:border-white/5 py-3 focus:border-zinc-900 dark:focus:border-white outline-none font-bold text-xs transition-all dark:text-white"
      />
    </div>
  );
}

function ToggleField({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between w-full pt-2">
      <span className="text-[9px] font-black uppercase text-zinc-400">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`w-12 h-6 rounded-full transition-all relative ${value ? 'bg-zinc-900 dark:bg-white' : 'bg-zinc-200 dark:bg-zinc-800'}`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${value ? 'right-1 bg-white dark:bg-black' : 'left-1 bg-white dark:bg-zinc-500'}`} />
      </button>
    </div>
  );
}

function ServiceSection({ title, isActive, onToggle, children }) {
  return (
    <div className={`space-y-8 p-8 rounded-[2.5rem] border transition-all ${isActive ? 'border-indigo-500/30 bg-indigo-50/5' : 'border-zinc-100 dark:border-white/5 opacity-50 grayscale'}`}>
      <div className="flex justify-between items-center">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] dark:text-white">{title}</h3>
        <button onClick={onToggle} className={`flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase transition-all ${isActive ? 'bg-indigo-500 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'}`}>
          <Power size={12} /> {isActive ? 'Active' : 'Offline'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {children}
      </div>
    </div>
  );
}

function ToggleButton({ isActive, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`w-14 h-8 rounded-full transition-all relative ${isActive ? 'bg-zinc-900 dark:bg-white' : 'bg-zinc-200 dark:bg-zinc-800'}`}
    >
      <div className={`absolute top-1 w-6 h-6 rounded-full transition-all ${isActive ? 'right-1 bg-white dark:bg-black' : 'left-1 bg-white dark:bg-zinc-500'}`} />
    </button>
  );
}

function ToggleRow({ label, description, isActive, onToggle }) {
  return (
    <div className="flex items-center justify-between p-6 bg-zinc-50 dark:bg-black/20 rounded-2xl border border-zinc-100 dark:border-white/5">
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest dark:text-white">{label}</p>
        <p className="text-[9px] text-zinc-500 mt-1">{description}</p>
      </div>
      <ToggleButton isActive={isActive} onClick={onToggle} />
    </div>
  );
}

function ImageUploadField({ label, value }) {
  return (
    <div className="space-y-4">
      <label className="text-[9px] font-black uppercase text-zinc-400">{label}</label>
      <div className="aspect-square bg-zinc-50 dark:bg-black/40 rounded-[2rem] border border-dashed border-zinc-200 dark:border-white/10 flex flex-col items-center justify-center overflow-hidden relative group cursor-pointer">
        {value ? (
          <img src={value} className="w-full h-full object-contain p-4 transition-transform group-hover:scale-110" alt="preview" />
        ) : (
          <span className="text-[8px] font-black uppercase text-zinc-400">Empty Asset</span>
        )}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-[8px] font-black uppercase text-white tracking-widest font-bold">Replace Asset</span>
        </div>
      </div>
    </div>
  );
}