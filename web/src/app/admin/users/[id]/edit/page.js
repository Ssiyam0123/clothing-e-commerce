"use client";

import { useParams, useRouter } from "next/navigation";
import { useUsers } from "@/hooks/useUsers";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Loader from "@/components/common/Loader";
import Link from "next/link";
import { 
  ArrowLeft, 
  ShieldCheck, 
  UserCheck,
  Save,
  ShieldAlert,
  History
} from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageUrl } from "@/utils/imageUtils";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { swalToast, swalError } from "@/utils/swal";

export default function UserEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const { useUser, updateUser } = useUsers();
  const { data: userData, isLoading: isUserLoading } = useUser(id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (userData) {
      setValue("name", userData.name);
      setValue("email", userData.email);
      setValue("phone", userData.phone || "");
      setValue("role", userData.role);
      setValue("isEmailVerified", userData.isEmailVerified);
    }
  }, [userData, setValue]);

  const onUpdateProfile = async (data) => {
    setIsSubmitting(true);
    try {
      await updateUser.mutateAsync({ id, data });
      swalToast("Identity Synchronized", "success");
      router.push("/admin/users");
    } catch (err) {
      swalError("System Conflict", err.response?.data?.message || "Failed to commit identity changes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isUserLoading)
    return (
      <div className="p-20">
        <Loader />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto pb-24 px-4 sm:px-6 space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* 🏔️ Tactical Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-card/50 backdrop-blur-3xl p-8 sm:p-10 rounded-[3rem] border border-border/10 shadow-2xl">
        <div className="flex items-center gap-6">
           <Avatar className="h-16 w-16 rounded-2xl border border-border/10">
              <AvatarImage src={getImageUrl(userData?.avatar)} />
              <AvatarFallback className="bg-accent font-black">{userData?.name?.[0]}</AvatarFallback>
           </Avatar>
           <div className="space-y-1">
              <h1 className="text-2xl font-black uppercase tracking-tighter italic">
                Modify Identity
              </h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                {userData?.name} // {userData?.email}
              </p>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/users/${id}`}
            className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-accent/10 border border-border/5 text-[10px] font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all"
          >
            <History size={14} />
            View Audit
          </Link>
          <Link
            href="/admin/users"
            className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-accent/10 border border-border/5 text-[10px] font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Abort
          </Link>
        </div>
      </div>

      {/* 📑 Identity Configuration Sector */}
      <form
        onSubmit={handleSubmit(onUpdateProfile)}
        className="bg-card/30 backdrop-blur-xl rounded-[3.5rem] border border-border/10 p-8 sm:p-14 shadow-2xl space-y-12"
      >
        <div className="space-y-10">
           <div className="flex items-center justify-between border-b border-border/5 pb-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground flex items-center gap-3">
                <ShieldAlert size={14} className="text-amber-500" /> Identity_Control_Module
              </h3>
              <Badge variant="outline" className="text-[8px] uppercase tracking-widest border-border/20 px-3 py-1">Secure Protocol</Badge>
           </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">
                Operative Name *
              </label>
              <input
                {...register("name", { required: true })}
                className="w-full bg-accent/5 border border-border/10 rounded-2xl p-5 font-black uppercase focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">
                Contact Email *
              </label>
              <input
                {...register("email", { required: true })}
                className="w-full bg-accent/5 border border-border/10 rounded-2xl p-5 font-black lowercase focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">
                Secure Phone
              </label>
              <input
                {...register("phone")}
                className="w-full bg-accent/5 border border-border/10 rounded-2xl p-5 font-black focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">
                Clearance Level
              </label>
              <select
                {...register("role")}
                className="w-full bg-accent/5 border border-border/10 rounded-2xl p-5 font-bold focus:border-blue-500 outline-none cursor-pointer appearance-none"
              >
                <option value="customer">Syndicate Member (Customer)</option>
                <option value="admin">Vanguard Admin (Root Access)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-accent/5 p-8 rounded-[2.5rem] border border-border/5">
            <input
              type="checkbox"
              {...register("isEmailVerified")}
              className="w-8 h-8 rounded-xl bg-background border-border/20 text-blue-600 focus:ring-0 cursor-pointer"
            />
            <div className="space-y-1">
               <p className="text-[10px] font-black uppercase tracking-widest text-foreground">
                 Verified Operational Status
               </p>
               <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Manual override for account security validation</p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-foreground text-background py-8 rounded-[2rem] font-black uppercase tracking-[0.5em] text-[11px] shadow-2xl hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-4 group"
        >
          <Save size={18} className="group-hover:scale-110 transition-transform" />
          {isSubmitting ? "Synchronizing..." : "Commit Identity Changes"}
        </button>
      </form>
    </div>
  );
}
