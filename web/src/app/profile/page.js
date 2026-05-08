"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";
import { getTranslation } from "@/utils/typography/handler";
import { toast } from "sonner";
import ProfileIdentity from "@/components/profile/ProfileIdentity";

export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore();
  const { lang } = useAppStore();
  const [loading, setLoading] = useState(false);

  const t = useMemo(() => getTranslation('profile', lang), [lang]);

  const handleUpdateProfile = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("phone", data.phone);
      formData.append("bio", data.bio);
      
      if (data.avatar && data.avatar[0]) {
        formData.append("avatar", data.avatar[0]);
      }

      await updateProfile(formData);

      toast.success(t.identityUpdated || "Identity Updated", {
        description: t.syncSuccess || "Your digital profile has been synchronized."
      });
    } catch (err) {
      toast.error(t.syncError || "Sync Error", {
        description: err.message || "Failed to update protocol identity."
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-card/40 backdrop-blur-2xl border border-border/10 rounded-[2.5rem] sm:rounded-[3.5rem] p-6 sm:p-10 md:p-16 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
      <ProfileIdentity 
        user={user} 
        ui={t} 
        onUpdate={handleUpdateProfile} 
        loading={loading} 
      />
    </div>
  );
}
