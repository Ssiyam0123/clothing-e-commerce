'use client';

import { useState, useEffect, Suspense, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useOrders } from '@/hooks/useOrders';
import { getImageUrl } from '@/utils/imageUtils';
import Alert from '@/components/common/Alert';
import Loader from '@/components/common/Loader';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAppStore } from '@/store/appStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';

const DICTIONARY = {
  en: {
    identity: 'Digital Identity',
    admin: 'Vanguard Admin',
    member: 'Syndicate Member',
    tabProfile: 'Identity Details',
    tabOrders: 'Order Archives',
    tabSecurity: 'Security',
    editTitle: 'Update Identity',
    editSub: 'Modify your personal information.',
    picLabel: 'Avatar',
    picSub: 'JPG, PNG up to 5MB',
    nameLabel: 'Full Name *',
    emailLabel: 'Email Address (Secured)',
    phoneLabel: 'Contact Number',
    bioLabel: 'Biography',
    saveBtn: 'Update Identity',
    saving: 'Updating...',
    orderTitle: 'Order Archives',
    orderSub: 'Track your historical transactions.',
    noOrders: 'No Archives Found',
    noOrdersSub: 'Your future acquisitions will appear here.',
    startShop: 'Explore Collection',
    orderId: 'Archive ID',
    date: 'Date',
    total: 'Total Amount',
    qty: 'Qty',
    payment: 'Settlement',
    trxId: 'TrxID',
    secTitle: 'Account Security',
    secSub: 'Update your cryptographic credentials.',
  },
  bn: {
    identity: 'ডিজিটাল আইডেন্টিটি',
    admin: 'ভ্যানগার্ড এডমিন',
    member: 'সিন্ডিকেট মেম্বার',
    tabProfile: 'প্রোফাইল ডিটেইলস',
    tabOrders: 'অর্ডার আর্কাইভ',
    tabSecurity: 'নিরাপত্তা',
    editTitle: 'প্রোফাইল আপডেট',
    editSub: 'আপনার ব্যক্তিগত তথ্য পরিবর্তন করুন।',
    picLabel: 'অ্যাভাটার',
    picSub: 'JPG, PNG (সর্বোচ্চ ৫ মেগাবাইট)',
    nameLabel: 'পুরো নাম *',
    emailLabel: 'ইমেইল অ্যাড্রেস (সুরক্ষিত)',
    phoneLabel: 'ফোন নম্বর',
    bioLabel: 'বায়োগ্রাফি',
    saveBtn: 'আপডেট করুন',
    saving: 'আপডেট হচ্ছে...',
    orderTitle: 'অর্ডার হিস্ট্রি',
    orderSub: 'আপনার অতীতের সব লেনদেন ট্র্যাক করুন।',
    noOrders: 'কোনো অর্ডার নেই',
    noOrdersSub: 'আপনার ভবিষ্যতের সব কেনাকাটা এখানে দেখা যাবে।',
    startShop: 'কালেকশন দেখুন',
    orderId: 'অর্ডার আইডি',
    date: 'তারিখ',
    total: 'মোট মূল্য',
    qty: 'পরিমাণ',
    payment: 'পেমেন্ট',
    trxId: 'ট্রানজেকশন আইডি',
    secTitle: 'অ্যাকাউন্টের নিরাপত্তা',
    secSub: 'আপনার পাসওয়ার্ড পরিবর্তন করুন।',
  }
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

function ProfileContent() {
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading, changePassword, updateProfile, uploadAvatar } = useAuthStore();
  const { myOrders, myOrdersLoading } = useOrders();

  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [activeTab, setActiveTab] = useState('orders');
  const fileInputRef = useRef(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { register: regPass, handleSubmit: handlePassSubmit, formState: { errors: passErrors }, reset: resetPassForm } = useForm();

  const { lang, isMounted } = useAppStore();
  const ui = useMemo(() => DICTIONARY[lang] || DICTIONARY['en'], [lang]);
  const isBn = lang === 'bn';
  const isLoggedIn = !!user;

  useEffect(() => {
    if (isLoggedIn) {
      const tab = searchParams.get('tab');
      if (tab) setActiveTab(tab);
    } else {
      setActiveTab('orders');
    }
  }, [searchParams, isLoggedIn]);

  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'success') {
      setSuccess('Payment successful! Your order has been placed.');
      window.history.replaceState(null, '', isLoggedIn ? '/profile?tab=orders' : '/profile');
    } else if (status === 'failed') {
      setError('Payment failed. Please try ordering again.');
      window.history.replaceState(null, '', isLoggedIn ? '/profile?tab=orders' : '/profile');
    }
  }, [searchParams, isLoggedIn]);

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('phone', user.phone || '');
      setValue('bio', user.bio || '');
      if (user.avatar) setAvatarPreview(getImageUrl(user.avatar));
    }
  }, [user, setValue]);

  const onSubmitProfile = async (data) => {
    try {
      setLoading(true);
      setError('');

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

      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitPassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      return setError("New passwords do not match.");
    }
    try {
      setPassLoading(true);
      setError('');
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      setSuccess('Password updated successfully! All other sessions terminated.');
      resetPassForm();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update password');
    } finally {
      setPassLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  if (!isMounted || authLoading) return <div className="min-h-screen flex items-center justify-center dark:bg-[#050505]"><Loader /></div>;

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#050505] py-8 sm:py-12 lg:py-24 transition-colors duration-700 overflow-x-hidden w-full relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="h-64 sm:h-80 bg-zinc-900 dark:bg-black absolute w-full top-0 left-0 z-0 rounded-b-[2rem] sm:rounded-b-[4rem] border-b border-zinc-800 dark:border-white/5 transition-colors duration-700"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tighter uppercase text-white mb-8 sm:mb-12 leading-none break-words drop-shadow-lg"
        >
          {isLoggedIn ? ui.identity : 'Order History'}
        </motion.h1>

        <AnimatePresence>
          {(error || success) && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-8 w-full overflow-hidden">
              {error && <Alert type="error" message={error} onClose={() => setError('')} />}
              {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile card (only for logged in users) */}
        {isLoggedIn && (
          <motion.div variants={fadeUpVariants} initial="hidden" animate="visible" className="bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-2xl rounded-[2rem] sm:rounded-[3rem] shadow-xl border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden mb-8 sm:mb-10">
            <div className="p-6 sm:p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 border-b border-zinc-100/50 dark:border-zinc-900/50">
              <div className="relative h-28 w-28 sm:h-32 sm:w-32 md:h-40 md:w-40 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 border-[6px] border-white dark:border-[#0a0a0a] shadow-xl shrink-0 group">
                {avatarPreview ? (
                  <img src={avatarPreview} alt={user.name} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" />
                ) : (
                  <div className="flex items-center justify-center h-full text-4xl sm:text-5xl font-black text-zinc-300 dark:text-zinc-700 bg-gradient-to-tr from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-zinc-800">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="text-center md:text-left flex-1">
                <h2 className={`text-2xl sm:text-3xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase mb-2 ${isBn ? 'font-sans' : ''}`}>{user.name}</h2>
                <p className="text-xs sm:text-sm font-bold text-zinc-500 tracking-widest mb-4 break-all">{user.email}</p>
                <div className="inline-flex items-center gap-2 bg-zinc-100 dark:bg-[#111] px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-inner">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
                    {user.role === 'admin' ? ui.admin : ui.member}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-8 md:px-12 py-3 sm:py-4 flex gap-2 sm:gap-4 overflow-x-auto no-scrollbar bg-zinc-50/50 dark:bg-zinc-900/10">
              {['profile', 'orders', 'security'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-4 sm:px-6 py-2 sm:py-3 rounded-full font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all shrink-0 ${
                    activeTab === tab ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
                  }`}
                >
                  {activeTab === tab && (
                    <motion.div layoutId="profileTabIndicator" className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-full shadow-sm border border-zinc-200 dark:border-zinc-700" />
                  )}
                  <span className="relative z-10">
                    {tab === 'profile' ? ui.tabProfile : tab === 'orders' ? ui.tabOrders : ui.tabSecurity}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* For guests, we show a simplified header */}
        {!isLoggedIn && (
          <div className="bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-2xl rounded-[2rem] sm:rounded-[3rem] shadow-xl border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden mb-8 sm:mb-10 p-6 sm:p-8 md:p-12">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white mb-4">{ui.orderTitle}</h2>
            <p className="text-[9px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-widest">{ui.orderSub}</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Profile Tab (only if logged in) */}
          {isLoggedIn && activeTab === 'profile' && (
            <motion.div key="profileForm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl rounded-[2rem] sm:rounded-[3rem] shadow-xl border border-zinc-100 dark:border-zinc-800/80 p-6 sm:p-8 md:p-14">
              <div className="mb-8 sm:mb-10">
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white mb-2">{ui.editTitle}</h3>
                <p className="text-[9px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-widest">{ui.editSub}</p>
              </div>

              <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-6 sm:space-y-8">
                <div>
                  <label className="block text-[9px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4">{ui.picLabel}</label>
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative h-20 w-20 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex-shrink-0 group">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <span className="flex items-center justify-center h-full text-zinc-400">+</span>
                      )}
                    </div>
                    <div className="text-center sm:text-left">
                      <button type="button" onClick={() => fileInputRef.current.click()} className="bg-zinc-100 dark:bg-[#111] text-zinc-900 dark:text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        Change Picture
                      </button>
                      <input type="file" accept="image/*" {...register('avatar')} onChange={handleAvatarChange} ref={fileInputRef} className="hidden" />
                      <p className="text-[8px] sm:text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-3">{ui.picSub}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <div className="w-full">
                    <label className="block text-[9px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 sm:mb-4">{ui.nameLabel}</label>
                    <input type="text" {...register('name', { required: 'Name is required' })} className="w-full bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 sm:px-6 py-3 sm:py-4 outline-none font-bold text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-white transition-all text-sm shadow-inner" />
                  </div>
                  <div className="w-full">
                    <label className="block text-[9px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 sm:mb-4">{ui.emailLabel}</label>
                    <input type="email" value={user.email} disabled className="w-full bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 sm:px-6 py-3 sm:py-4 outline-none font-bold text-zinc-400 dark:text-zinc-600 cursor-not-allowed text-sm" />
                  </div>
                </div>

                <div className="w-full">
                  <label className="block text-[9px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 sm:mb-4">{ui.phoneLabel}</label>
                  <input type="tel" {...register('phone')} placeholder="+880 1..." className="w-full md:w-1/2 bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 sm:px-6 py-3 sm:py-4 outline-none font-bold text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-white transition-all text-sm shadow-inner" />
                </div>

                <div className="w-full">
                  <label className="block text-[9px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 sm:mb-4">{ui.bioLabel}</label>
                  <textarea {...register('bio')} rows="4" className="w-full bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-[1.5rem] sm:rounded-[2rem] px-5 sm:px-6 py-5 sm:py-6 outline-none font-medium text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-white transition-all resize-none text-sm shadow-inner" placeholder="Tell us about your aesthetic..." />
                </div>

                <div className="pt-6 border-t border-zinc-100 dark:border-zinc-900">
                  <button type="submit" disabled={loading} className="w-full md:w-auto bg-zinc-900 dark:bg-white text-white dark:text-black px-10 sm:px-12 py-4 sm:py-5 rounded-full font-black uppercase tracking-[0.2em] text-[10px] sm:text-[11px] hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50 border border-transparent dark:border-white/10">
                    {loading ? ui.saving : ui.saveBtn}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Security Tab (only if logged in) */}
          {isLoggedIn && activeTab === 'security' && (
            <motion.div key="securityForm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl rounded-[2rem] sm:rounded-[3rem] shadow-xl border border-zinc-100 dark:border-zinc-800/80 p-6 sm:p-8 md:p-14 w-full">
              <div className="mb-8 sm:mb-10">
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white mb-2">{ui.secTitle}</h3>
                <p className="text-[9px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-widest">{ui.secSub}</p>
              </div>

              <form onSubmit={handlePassSubmit(onSubmitPassword)} className="space-y-6 sm:space-y-8 max-w-xl">
                <div className="w-full">
                  <label className="block text-[9px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 sm:mb-4">Current Password</label>
                  <input type="password" {...regPass('currentPassword', { required: 'Current password is required' })} className="w-full bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 sm:px-6 py-3 sm:py-4 outline-none font-bold text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-white transition-all text-sm shadow-inner" placeholder="••••••••" />
                  {passErrors.currentPassword && <p className="text-rose-500 text-[9px] sm:text-[10px] font-bold mt-2 uppercase">{passErrors.currentPassword.message}</p>}
                </div>
                <div className="w-full">
                  <label className="block text-[9px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 sm:mb-4">New Password</label>
                  <input type="password" {...regPass('newPassword', { required: 'New password is required', minLength: { value: 6, message: "Min 6 characters" } })} className="w-full bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 sm:px-6 py-3 sm:py-4 outline-none font-bold text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-white transition-all text-sm shadow-inner" placeholder="••••••••" />
                  {passErrors.newPassword && <p className="text-rose-500 text-[9px] sm:text-[10px] font-bold mt-2 uppercase">{passErrors.newPassword.message}</p>}
                </div>
                <div className="w-full">
                  <label className="block text-[9px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 sm:mb-4">Confirm New Password</label>
                  <input type="password" {...regPass('confirmPassword', { required: 'Confirm password is required' })} className="w-full bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 sm:px-6 py-3 sm:py-4 outline-none font-bold text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-white transition-all text-sm shadow-inner" placeholder="••••••••" />
                  {passErrors.confirmPassword && <p className="text-rose-500 text-[9px] sm:text-[10px] font-bold mt-2 uppercase">{passErrors.confirmPassword.message}</p>}
                </div>
                <div className="pt-6 border-t border-zinc-100 dark:border-zinc-900">
                  <button type="submit" disabled={passLoading} className="w-full md:w-auto bg-rose-600 dark:bg-rose-500 text-white py-4 sm:py-5 px-10 sm:px-12 rounded-full font-black uppercase tracking-[0.2em] text-[10px] sm:text-[11px] hover:bg-rose-700 hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50 border border-transparent">
                    {passLoading ? 'Verifying...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Orders Tab (always shown) */}
          {(activeTab === 'orders' || !isLoggedIn) && (
            <motion.div key="ordersTab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl rounded-[2rem] sm:rounded-[3rem] shadow-xl border border-zinc-100 dark:border-zinc-800/80 p-4 sm:p-8 md:p-14 w-full">
              <div className="mb-8 sm:mb-10 px-2 md:px-0">
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white mb-2">{ui.orderTitle}</h3>
                <p className="text-[9px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-widest">{ui.orderSub}</p>
              </div>

              {myOrdersLoading ? (
                <div className="py-20"><Loader /></div>
              ) : !myOrders || myOrders.length === 0 ? (
                <div className="py-16 sm:py-24 text-center border border-dashed border-zinc-200 dark:border-zinc-800/50 rounded-[1.5rem] sm:rounded-[2rem] bg-zinc-50/50 dark:bg-[#111]/30">
                  <span className="text-5xl sm:text-6xl block mb-6 grayscale opacity-20 drop-shadow-sm">📦</span>
                  <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white mb-2">{ui.noOrders}</h3>
                  <p className="text-[9px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-8">{ui.noOrdersSub}</p>
                  <Link href="/products" className="inline-block bg-zinc-900 dark:bg-white text-white dark:text-black px-8 sm:px-10 py-3 sm:py-4 rounded-full font-black uppercase tracking-widest text-[9px] sm:text-[10px] hover:scale-105 transition-all shadow-xl">
                    {ui.startShop}
                  </Link>
                </div>
              ) : (
                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6 sm:space-y-8 w-full">
                  {myOrders.map(order => (
                    <motion.div variants={fadeUpVariants} key={order._id} className="border border-zinc-200 dark:border-zinc-800 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden group hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-500 w-full bg-white dark:bg-[#0d0d0d] shadow-sm hover:shadow-lg">
                      <div className="bg-zinc-50/80 dark:bg-[#111]/80 backdrop-blur-md p-4 sm:p-6 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 border-b border-zinc-200 dark:border-zinc-800">
                        <div>
                          <p className="text-[8px] sm:text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">{ui.orderId}</p>
                          <p className="font-mono text-xs sm:text-sm font-bold text-zinc-900 dark:text-white uppercase truncate">#{order._id.slice(-8)}</p>
                        </div>
                        <div>
                          <p className="text-[8px] sm:text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">{ui.date}</p>
                          <p className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-[8px] sm:text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">{ui.total}</p>
                          <p className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white tracking-tighter">${order.totalPrice.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center">
                          <span className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[8px] sm:text-[10px] font-black uppercase tracking-widest rounded-full border text-center w-full lg:w-auto shadow-sm ${
                            order.orderStatus === 'Delivered' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' :
                            order.orderStatus === 'Cancelled' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20' :
                            'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                          }`}>
                            {order.orderStatus}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 sm:p-6 divide-y divide-zinc-100 dark:divide-zinc-800/50">
                        {order.orderItems.map((item, idx) => (
                          <div key={idx} className="py-4 flex items-center gap-4 sm:gap-6">
                            <div className="relative h-16 w-12 sm:h-20 sm:w-16 bg-zinc-100 dark:bg-zinc-900 rounded-lg sm:rounded-xl overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-800">
                              {item.image ? (
                                <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" />
                              ) : (
                                <div className="flex h-full items-center justify-center text-lg grayscale opacity-30">👕</div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <Link href={`/products/${item.product}`} className={`text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 hover:text-zinc-500 transition-colors line-clamp-1 ${isBn ? 'font-sans' : ''}`}>
                                {item.name}
                              </Link>
                              <p className="text-[8px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1 sm:mt-2">{ui.qty}: {item.quantity}</p>
                            </div>
                            <div className="text-sm sm:text-base font-black text-zinc-900 dark:text-white tracking-tighter shrink-0">
                              ${item.price.toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-zinc-50/50 dark:bg-[#111]/50 p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-zinc-200 dark:border-zinc-800">
                        <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-500">
                          {ui.payment}: <span className="text-zinc-900 dark:text-white">{order.paymentMethod}</span> ({order.paymentResult?.status || 'Pending'})
                        </span>
                        {order.paymentResult?.transactionId && (
                          <span className="font-mono text-[8px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest break-all bg-white dark:bg-black px-3 py-1 rounded-md border border-zinc-200 dark:border-zinc-800">
                            {ui.trxId}: {order.paymentResult.transactionId}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center dark:bg-[#050505]"><Loader /></div>}>
      <ProfileContent />
    </Suspense>
  );
}