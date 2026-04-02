'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useEffect, useState, useRef } from 'react';
import { useUsers } from '@/hooks/useUsers';
import Loader from '@/components/common/Loader';
import { getImageUrl } from '@/utils/imageUtils';
import Link from 'next/link';
// 1. Swal Utilities Import
import { swalToast, swalError } from '@/utils/swal';

export default function UserForm() {
  const { id } = useParams();
  const router = useRouter();
  const isEdit = id !== 'new';

  const { users, updateUser } = useUsers();
  const [loading, setLoading] = useState(isEdit);
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  const fileInputRef = useRef(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    if (isEdit && users) {
      const user = users.find((u) => u._id === id);
      if (user) {
        setValue('name', user.name);
        setValue('email', user.email);
        setValue('role', user.role);
        if (user.avatar) setAvatarPreview(getImageUrl(user.avatar));
        setLoading(false);
      } else if (users) {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [isEdit, id, users, setValue]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name.trim());
    formData.append('email', data.email.trim());
    formData.append('role', data.role);
    
    if (data.imageFile && data.imageFile[0]) {
      formData.append('avatar', data.imageFile[0]);
    }

    try {
      await updateUser.mutateAsync({ id, data: formData });
      // SUCCESS TOAST
      swalToast('Identity Synchronized', 'success');
      setTimeout(() => router.push('/admin/users'), 1500);
    } catch (err) {
      // ERROR MODAL
      swalError('Sync Failed', err.response?.data?.message || 'Could not update user configuration.');
    }
  };

  if (loading) return <div className="p-20"><Loader /></div>;

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-10 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase mb-2">
            {isEdit ? 'Configure User' : 'Initialize Identity'}
          </h1>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Identity & Role Protocol</p>
        </div>
        <Link href="/admin/users" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
          ← Cancel & Return
        </Link>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8 md:p-12 shadow-sm space-y-8">
        
        {/* Avatar Upload */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="relative h-32 w-32 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 border-4 border-zinc-50 dark:border-[#111] shadow-xl mb-4 group">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
            ) : (
              <div className="flex items-center justify-center h-full text-4xl grayscale opacity-30">👤</div>
            )}
            <div onClick={() => fileInputRef.current.click()} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-[10px] font-black uppercase tracking-widest">
              Update
            </div>
          </div>
          <input 
            type="file" 
            accept="image/*" 
            {...register('imageFile')} 
            onChange={handleAvatarChange} 
            ref={(e) => {
              register('imageFile').ref(e);
              fileInputRef.current = e;
            }}
            className="hidden" 
          />
          <button type="button" onClick={() => fileInputRef.current.click()} className="text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-zinc-900 dark:hover:text-white transition-colors">
            Upload Identification Visual
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">Legal Name *</label>
            <input 
              type="text" 
              {...register('name', { required: true })} 
              className="w-full bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 outline-none font-bold text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-white transition-all" 
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">Registered Email *</label>
            <input 
              type="email" 
              {...register('email', { required: true })} 
              className={`w-full bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 outline-none font-bold ${isEdit ? 'text-zinc-500 opacity-60 cursor-not-allowed' : 'text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-white'} transition-all`} 
              readOnly={isEdit}
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">Clearance Assignment *</label>
          <select 
            {...register('role', { required: true })} 
            className="w-full bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 outline-none font-bold text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-white transition-all cursor-pointer"
          >
            <option value="customer">Syndicate Member (Customer)</option>
            <option value="admin">Vanguard Admin (Power User)</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-zinc-100 dark:border-zinc-800 mt-8">
          <button type="submit" className="flex-[2] bg-zinc-900 dark:bg-white text-white dark:text-black py-5 rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:scale-105 active:scale-95 transition-all shadow-2xl">
            {isEdit ? 'Sync Architecture' : 'Initialize Identity'}
          </button>
          <button type="button" onClick={() => router.push('/admin/users')} className="flex-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 py-5 rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:text-zinc-900 dark:hover:text-white transition-all border border-zinc-200 dark:border-zinc-800">
            Discard
          </button>
        </div>

      </form>
    </div>
  );
}