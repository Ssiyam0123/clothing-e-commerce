"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/store/appStore";
import { useProfile } from "@/app/profile/lib/useProfile";
import { getTranslation } from "@/utils/typography/handler";
import { toast } from "sonner";
import ProfileIdentity from "@/app/profile/components/ProfileIdentity";

export default function ProfileDetailsPage() {
  const { user, updateProfile } = useProfile();
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
      formData.append("addresses", JSON.stringify([{ address: data.address, isDefault: true }]));
      
      if (data.avatar && data.avatar[0]) {
        formData.append("avatar", data.avatar[0]);
      }

      await updateProfile(formData);

      toast.success(t.identityUpdated || "Profile Updated", {
        description: t.syncSuccess || "Your profile information has been updated."
      });
    } catch (err) {
      toast.error(t.syncError || "Error", {
        description: err.message || "Failed to update profile."
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



