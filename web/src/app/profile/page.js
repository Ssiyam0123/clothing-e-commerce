"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import ProfileIdentity from "@/components/profile/ProfileIdentity";

const DICTIONARY = {
  en: {
    editTitle: "Protocol Identity",
    editSub: "Modify your digital footprint within the syndicate.",
    picLabel: "Identity Avatar",
    picSub: "Recommended: 1:1 Aspect Ratio",
    nameLabel: "Full Alias",
    emailLabel: "Secured Channel",
    phoneLabel: "Contact Frequency",
    bioLabel: "Identity Brief",
    saveBtn: "Commit Changes",
    saving: "Synchronizing...",
  },
  bn: {
    editTitle: "প্রোটোকল আইডেন্টিটি",
    editSub: "সিন্ডিকেটের মধ্যে আপনার ডিজিটাল পদচিহ্ন পরিবর্তন করুন।",
    picLabel: "আইডেন্টিটি অ্যাভাটার",
    picSub: "পরামর্শ: ১:১ অ্যাসপেক্ট রেশিও",
    nameLabel: "পূর্ণ নাম",
    emailLabel: "সুরক্ষিত চ্যানেল",
    phoneLabel: "যোগাযোগ নম্বর",
    bioLabel: "জীবনবৃত্তান্ত",
    saveBtn: "পরিবর্তন সংরক্ষণ",
    saving: "সিংক্রোনাইজিং...",
  },
};

export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore();
  const { lang } = useAppStore();
  const [loading, setLoading] = useState(false);

  const ui = useMemo(() => DICTIONARY[lang] || DICTIONARY["en"], [lang]);

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

      toast.success("Identity Updated", {
        description: "Your digital profile has been synchronized."
      });
    } catch (err) {
      toast.error("Sync Error", {
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
        ui={ui} 
        onUpdate={handleUpdateProfile} 
        loading={loading} 
      />
    </div>
  );
}
