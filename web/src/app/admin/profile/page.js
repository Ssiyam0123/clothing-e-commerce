"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { getImageUrl } from "@/utils/imageUtils";
import api from "@/lib/api";
import Alert from "@/components/common/Alert";
import Loader from "@/components/common/Loader";
import ProtectedRoute from "@/app/admin/_components/ProtectedRoute";
import AdminLayout from "../layout";
import { useAuthStore } from "@/store/authStore";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Camera, 
  Upload, 
  User, 
  Mail, 
  Phone, 
  ShieldCheck 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminPageHeader from "@/app/admin/_components/AdminPageHeader";

export default function AdminProfile() {
  const { user, isLoading: authLoading } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("phone", user.phone || "");
      setValue("bio", user.bio || "");
      if (user.avatar) {
        setAvatarPreview(getImageUrl(user.avatar));
      }
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.phone) formData.append("phone", data.phone);
    if (data.bio) formData.append("bio", data.bio);
    if (data.avatar && data.avatar[0]) {
      formData.append("avatar", data.avatar[0]);
    }

    try {
      setLoading(true);
      const response = await api.put("/users/profile", formData);
      setSuccess("Profile updated successfully!");
      // Update user in localStorage
      localStorage.setItem("user", JSON.stringify(response.data));
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (authLoading) return <Loader />;
  if (!user) return null;

  return (
    <ProtectedRoute>
        <div className="admin-page-container">
          {/* 🛰️ System Header */}
          <AdminPageHeader
            title="My profile"
            description="Update your name, contact details, and password."
          />

          <div className="max-w-4xl">
            <Card className="rounded-[2rem] md:rounded-[3rem] border-border/10 bg-card/30 backdrop-blur-2xl shadow-2xl overflow-hidden">
              <CardContent className="p-6 md:p-12">
                {error && (
                  <div className="mb-8">
                    <Alert
                      type="error"
                      message={error}
                      onClose={() => setError("")}
                    />
                  </div>
                )}
                {success && (
                  <div className="mb-8">
                    <Alert
                      type="success"
                      message={success}
                      onClose={() => setSuccess("")}
                    />
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 md:space-y-12">
                  {/* Avatar Upload */}
                  <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                      Neural Identifier (Avatar)
                    </label>
                    <div className="flex flex-col md:flex-row md:items-center gap-8">
                      <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-3xl md:rounded-[2.5rem] overflow-hidden bg-accent/5 border border-border/10 group/avatar shrink-0">
                        {avatarPreview ? (
                          <img
                            src={avatarPreview}
                            alt="Profile"
                            className="w-full h-full object-cover grayscale group-hover/avatar:grayscale-0 transition-all duration-700"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-3xl font-black text-muted-foreground italic uppercase">
                            {user.name?.charAt(0)}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                           <Camera size={24} className="text-white" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="relative">
                          <input
                            type="file"
                            id="avatar-upload"
                            accept="image/*"
                            {...register("avatar")}
                            onChange={handleAvatarChange}
                            className="hidden"
                          />
                          <label 
                            htmlFor="avatar-upload"
                            className="inline-flex items-center gap-3 bg-foreground text-background hover:bg-rose-600 hover:text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest cursor-pointer transition-all active:scale-95 shadow-xl"
                          >
                            <Upload size={14} /> Synchronize Media
                          </label>
                        </div>
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest italic opacity-50">
                          Format: JPEG, PNG, WEBP • Max: 5MB
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {/* Name */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                        Designation Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <input
                          type="text"
                          {...register("name", { required: "Name is required" })}
                          placeholder="Personnel Name"
                          className="w-full bg-background/50 border border-border/10 rounded-xl h-14 md:h-16 pl-14 pr-6 text-[11px] font-black uppercase tracking-widest focus:border-rose-600 transition-all outline-none"
                        />
                      </div>
                      {errors.name && (
                        <p className="text-rose-600 text-[10px] font-black uppercase italic tracking-widest">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                        Comm Channel (Phone)
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <input
                          type="tel"
                          {...register("phone")}
                          placeholder="+880 XXX XXX XXXX"
                          className="w-full bg-background/50 border border-border/10 rounded-xl h-14 md:h-16 pl-14 pr-6 text-[11px] font-black uppercase tracking-widest focus:border-rose-600 transition-all outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                      Neural Key (Email) • <span className="text-rose-600/50">Immutable</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/30" size={16} />
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full bg-accent/5 border border-border/5 rounded-xl h-14 md:h-16 pl-14 pr-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground/50 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                      Neural Dossier (Bio)
                    </label>
                    <textarea
                      {...register("bio")}
                      rows="4"
                      placeholder="Brief personnel description..."
                      className="w-full bg-background/50 border border-border/10 rounded-2xl p-6 text-[11px] font-black uppercase tracking-widest focus:border-rose-600 transition-all outline-none resize-none"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col md:flex-row gap-4 pt-6">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-foreground text-background hover:bg-rose-600 hover:text-white h-14 md:h-16 px-10 rounded-xl md:rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 group flex-1"
                    >
                      {loading ? (
                         <div className="flex items-center gap-3">
                            <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                            Syncing...
                         </div>
                      ) : (
                        <div className="flex items-center gap-3">
                           <ShieldCheck size={18} /> Apply Synchronizations
                        </div>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => window.location.reload()}
                      className="h-14 md:h-16 px-10 rounded-xl md:rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] border-border/10 hover:bg-accent transition-all flex-1"
                    >
                      Discard Latency
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
    </ProtectedRoute>
  );
}
