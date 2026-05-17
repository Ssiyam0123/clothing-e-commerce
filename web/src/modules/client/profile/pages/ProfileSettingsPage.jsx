"use client";

import { useState, useMemo } from "react";
import { useProfile } from "@/modules/client/profile/lib/useProfile";
import { useAppStore } from "@/store/appStore";
import { toast } from "sonner";
import ProfileSecurity from "@/modules/client/profile/components/ProfileSecurity";

const DICTIONARY = {
  en: {
    secTitle: "Security & Password",
    secSub: "Manage your password and keep your account secure.",
  },
  bn: {
    secTitle: "নিরাপত্তা ও পাসওয়ার্ড",
    secSub: "আপনার পাসওয়ার্ড পরিবর্তন করুন এবং অ্যাকাউন্ট নিরাপদ রাখুন।",
  },
};

export default function ProfileSettingsPage() {
  const { changePassword } = useProfile();
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
      toast.success("Password Updated", {
        description: "Your password has been changed successfully."
      });
      return true;
    } catch (err) {
      toast.error("Error", {
        description: err.message || "Failed to update password."
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
