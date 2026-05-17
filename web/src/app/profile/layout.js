"use client";

import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";
import ProfileHeader from "@/app/profile/components/ProfileHeader";
import ProfileMobileNav from "@/app/profile/components/ProfileMobileNav";
import Loader from "@/components/common/Loader";
import { useMemo, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, Package, ShieldCheck, ChevronRight, Activity, Zap, CreditCard, LifeBuoy } from "lucide-react";
import { cn } from "@/lib/utils";

const DICTIONARY = {
  en: {
    admin: "Administrator",
    member: "Valued Member",
    profile: "My Profile",
    orders: "My Orders",
    security: "Security",
    status: "Account Status",
    active: "Active",
    level: "Membership Level",
    sync: "Profile Sync",
    complete: "Verified",
  },
  bn: {
    admin: "অ্যাডমিনিস্ট্রেটর",
    member: "সম্মানিত সদস্য",
    profile: "আমার প্রোফাইল",
    orders: "আমার অর্ডার",
    security: "নিরাপত্তা",
    status: "অ্যাকাউন্ট স্ট্যাটাস",
    active: "সক্রিয়",
    level: "মেম্বারশিপ লেভেল",
    sync: "প্রোফাইল সিঙ্ক",
    complete: "ভেরিফাইড",
  },
};

export default function ProfileLayout({ children }) {
  const { user, isLoading: authLoading } = useAuthStore();
  const { lang, isMounted } = useAppStore();
  const pathname = usePathname();
  const router = useRouter();

  const ui = useMemo(() => DICTIONARY[lang] || DICTIONARY["en"], [lang]);

  useEffect(() => {
    if (isMounted && !authLoading) {
      if (!user) {
        router.push("/login");
      } else if (pathname === "/profile") {
        router.replace("/profile/order");
      }
    }
  }, [isMounted, authLoading, user, router, pathname]);

  if (!isMounted || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!user) return null;

  const navItems = [
    {
      label: ui.orders,
      href: "/profile/order",
      icon: Package,
      active: pathname === "/profile/order",
    },
    {
      label: ui.profile,
      href: "/profile/details",
      icon: User,
      active: pathname === "/profile/details",
    },
    {
      label: ui.security,
      href: "/profile/setting",
      icon: ShieldCheck,
      active: pathname === "/profile/setting",
    },
  ];

  return (
    <div className="min-h-screen pt-12 md:pt-32 pb-12 md:pb-32 bg-background relative overflow-hidden">
      {/* 🌌 Cybernetic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-accent/10 to-transparent -z-10" />
      <div className="absolute top-1/4 -right-24 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 -left-24 w-80 h-80 bg-accent-secondary/5 blur-[100px] rounded-full -z-10" />
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10">
        <ProfileHeader user={user} ui={ui} />

        <div className="mt-8 md:mt-20">
          <main className="relative pb-32">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* 📱 Universal Floating Navigation - App-like experience */}
      <ProfileMobileNav navItems={navItems} />
    </div>
  );
}
