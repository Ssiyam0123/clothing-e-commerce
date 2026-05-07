"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { useOrders } from "@/hooks/useOrders";
import { useSearchParams } from "next/navigation";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Loader from "@/components/common/Loader";

// Modular Components
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileOrders from "@/components/profile/ProfileOrders";
import ProfileIdentity from "@/components/profile/ProfileIdentity";
import ProfileSecurity from "@/components/profile/ProfileSecurity";
import OrderDetailsDialog from "@/components/profile/OrderDetailsDialog";

const DICTIONARY = {
  en: {
    admin: "System Admin",
    member: "Elite Member",
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
    orderTitle: "Collection Archives",
    orderSub: "Historical records of your premium acquisitions.",
    noOrders: "No Assets Logged",
    noOrdersSub: "Your archive is currently empty. Initiate your first drop.",
    startShop: "Enter Marketplace",
    secTitle: "Security Protocol",
    secSub: "Manage your cryptographic access credentials.",
  },
  bn: {
    admin: "সিস্টেম এডমিন",
    member: "এলিট মেম্বার",
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
    orderTitle: "কালেকশন আর্কাইভ",
    orderSub: "আপনার প্রিমিয়াম কেনাকাটার ঐতিহাসিক রেকর্ড।",
    noOrders: "কোনো সম্পদ নেই",
    noOrdersSub: "আপনার আর্কাইভ বর্তমানে খালি। প্রথম ড্রপ শুরু করুন।",
    startShop: "মার্কেটপ্লেসে প্রবেশ",
    secTitle: "নিরাপত্তা প্রোটোকল",
    secSub: "আপনার ক্রিপ্টোগ্রাফিক অ্যাক্সেস শংসাপত্র পরিচালনা করুন।",
  },
};

function ProfileContent() {
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading, changePassword, updateProfile, uploadAvatar } = useAuthStore();
  const { myOrders, myOrdersLoading } = useOrders();
  const { lang, isMounted } = useAppStore();
  
  const [activeTab, setActiveTab] = useState("orders");
  const [loading, setLoading] = useState(false);
  const [secLoading, setSecLoading] = useState(false);
  
  // Order Details Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const ui = useMemo(() => DICTIONARY[lang] || DICTIONARY["en"], [lang]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    const status = searchParams.get("status");

    if (tab) setActiveTab(tab);
    
    if (status === "success") {
      toast.success("Transaction Logged Successfully", {
        description: "Your order sequence has been initiated."
      });
      window.history.replaceState(null, "", "/profile?tab=orders");
    } else if (status === "failed") {
      toast.error("Protocol Interrupted", {
        description: "Payment failed. Please re-initiate the sequence."
      });
      window.history.replaceState(null, "", "/profile?tab=orders");
    }
  }, [searchParams]);

  const handleOpenDetails = (id) => {
    setSelectedOrder(id);
    setDetailsOpen(true);
  };

  const handleUpdateProfile = async (data) => {
    try {
      setLoading(true);
      let imageUrl = null;
      
      if (data.avatar && data.avatar[0]) {
        imageUrl = await uploadAvatar(data.avatar[0]);
      }

      await updateProfile({
        name: data.name,
        phone: data.phone,
        bio: data.bio,
        ...(imageUrl && { image: imageUrl }),
      });

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

  if (!isMounted || authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <ProfileHeader user={user} ui={ui} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-accent/5 p-1 rounded-full mb-16 h-auto border border-border/20">
            <TabsTrigger value="orders" className="rounded-full px-8 py-3 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-foreground data-[state=active]:text-background transition-all">
              Archive Log
            </TabsTrigger>
            <TabsTrigger value="profile" className="rounded-full px-8 py-3 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-foreground data-[state=active]:text-background transition-all">
              Identity details
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-full px-8 py-3 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-foreground data-[state=active]:text-background transition-all">
              Security Protocol
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-0 focus-visible:outline-none">
            <ProfileOrders 
              orders={myOrders} 
              ui={ui} 
              loading={myOrdersLoading} 
              onOpenDetails={handleOpenDetails}
            />
          </TabsContent>

          <TabsContent value="profile" className="mt-0 focus-visible:outline-none">
            <div className="bg-background border border-border/30 rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-primary/5">
              <ProfileIdentity 
                user={user} 
                ui={ui} 
                onUpdate={handleUpdateProfile} 
                loading={loading} 
              />
            </div>
          </TabsContent>

          <TabsContent value="security" className="mt-0 focus-visible:outline-none">
            <div className="bg-background border border-border/30 rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-primary/5">
              <ProfileSecurity 
                ui={ui} 
                onUpdate={handleUpdateSecurity} 
                loading={secLoading} 
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <OrderDetailsDialog 
        orderId={selectedOrder} 
        open={detailsOpen} 
        onOpenChange={setDetailsOpen} 
        ui={ui} 
      />
    </div>
  );
}

export default function Profile() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader /></div>}>
      <ProfileContent />
    </Suspense>
  );
}
