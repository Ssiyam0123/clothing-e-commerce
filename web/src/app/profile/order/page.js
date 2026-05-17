"use client";

import { useState, useMemo, useEffect } from "react";
import { useProfileOrders } from "@/app/profile/lib/useProfileOrders";
import { useSearchParams } from "next/navigation";
import { useAppStore } from "@/store/appStore";
import { toast } from "sonner";
import ProfileOrders from "@/app/profile/components/ProfileOrders";
import OrderDetailsDialog from "@/app/profile/components/OrderDetailsDialog";

const DICTIONARY = {
  en: {
    orderTitle: "Collection Archives",
    orderSub: "Historical records of your premium acquisitions.",
    noOrders: "No Assets Logged",
    noOrdersSub: "Your archive is currently empty. Initiate your first drop.",
    startShop: "Enter Marketplace",
  },
  bn: {
    orderTitle: "কালেকশন আর্কাইভ",
    orderSub: "আপনার প্রিমিয়াম কেনাকাটার ঐতিহাসিক রেকর্ড।",
    noOrders: "কোনো সম্পদ নেই",
    noOrdersSub: "আপনার আর্কাইভ বর্তমানে খালি। প্রথম ড্রপ শুরু করুন।",
    startShop: "মার্কেটপ্লেসে প্রবেশ",
  },
};

export default function ProfileOrdersPage() {
  const searchParams = useSearchParams();
  const { myOrders, myOrdersLoading } = useProfileOrders();
  const { lang } = useAppStore();
  
  // Order Details Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const ui = useMemo(() => DICTIONARY[lang] || DICTIONARY["en"], [lang]);

  useEffect(() => {
    const status = searchParams.get("status");

    if (status === "success") {
      toast.success("Transaction Logged Successfully", {
        description: "Your order sequence has been initiated."
      });
      window.history.replaceState(null, "", "/profile/order");
    } else if (status === "failed") {
      toast.error("Protocol Interrupted", {
        description: "Payment failed. Please re-initiate the sequence."
      });
      window.history.replaceState(null, "", "/profile/order");
    }
  }, [searchParams]);

  const handleOpenDetails = (id) => {
    setSelectedOrder(id);
    setDetailsOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <ProfileOrders 
        orders={myOrders} 
        ui={ui} 
        loading={myOrdersLoading} 
        onOpenDetails={handleOpenDetails}
      />

      <OrderDetailsDialog 
        orderId={selectedOrder} 
        open={detailsOpen} 
        onOpenChange={setDetailsOpen} 
        ui={ui} 
      />
    </div>
  );
}



