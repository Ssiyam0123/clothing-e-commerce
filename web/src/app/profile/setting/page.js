"use client";

import { useState, useMemo } from "react";
import { useAuthStore } from "@/store/authStore";
import { useAppStore } from "@/store/appStore";
import { toast } from "sonner";
import ProfileSecurity from "@/components/profile/ProfileSecurity";

const DICTIONARY = {
  en: {
    secTitle: "Security Protocol",
    secSub: "Manage your cryptographic access credentials.",
  },
  bn: {
    secTitle: "নিরাপত্তা প্রোটোকল",
    secSub: "আপনার ক্রিপ্টোগ্রাফিক অ্যাক্সেস শংসাপত্র পরিচালনা করুন।",
  },
};

export default function SettingsPage() {
  const { changePassword } = useAuthStore();
  const { lang } = useAppStore();
  const [secLoading, setSecLoading] = useState(false);

  const ui = useMemo(() => DICTIONARY[lang] || DICTIONARY["en"], [lang]);

  const handleUpdateSecurity = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Credential Mismatch", {
        description: "New passwords do not align."
      });
      return false;
    }
    try {
      setSecLoading(true);
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Protocol Secured", {
        description: "Cryptographic credentials updated. All other sessions terminated."
      });
      return true;
    } catch (err) {
      toast.error("Security Breach", {
        description: err.message || "Credential update failed."
      });
      return false;
    } finally {
      setSecLoading(false);
    }
  };

  return (
    <div className="bg-card/40 backdrop-blur-2xl border border-border/10 rounded-[2.5rem] sm:rounded-[3.5rem] p-6 sm:p-10 md:p-16 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
      <ProfileSecurity 
        ui={ui} 
        onUpdate={handleUpdateSecurity} 
        loading={secLoading} 
      />
    </div>
  );
}
