'use client';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loader from '../common/Loader';
import { motion } from 'framer-motion';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isLoading) return; // 👈 সেশন চেক শেষ না হওয়া পর্যন্ত ওয়েট

    if (!isAuthenticated) {
      // 🌟 লগইন পেজে পাঠানোর সময় রিডাইরেক্ট URL দিয়ে পাঠানো স্মার্ট আইডিয়া
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (adminOnly && user?.role !== 'admin') {
      router.replace('/');
    } else {
      setIsAuthorized(true); // 👈 সব চেক পাস করলে তবেই কম্পোনেন্ট রেন্ডার হবে
    }
  }, [isLoading, isAuthenticated, user, router, adminOnly, pathname]);

  if (isLoading || !isAuthorized) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#fcfcfc] dark:bg-[#050505] transition-colors duration-700">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
           <Loader />
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}