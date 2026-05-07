"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/utils/imageUtils";
import { Sparkles, ShieldCheck, User } from "lucide-react";

export default function ProfileHeader({ user, ui }) {
  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full mb-12"
    >
      {/* Decorative background element */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-12">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-accent-secondary to-primary blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full" />
          <Avatar className="h-32 w-32 md:h-48 md:w-48 border-[6px] border-background shadow-2xl relative z-10">
            <AvatarImage src={getImageUrl(user.avatar)} alt={user.name} className="object-cover" />
            <AvatarFallback className="bg-accent text-4xl font-black">
              {user.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="absolute -bottom-2 -right-2 z-20 bg-background border border-border p-3 rounded-2xl shadow-xl">
             {user.role === 'admin' ? (
               <ShieldCheck className="w-6 h-6 text-accent-secondary" />
             ) : (
               <User className="w-6 h-6 text-primary" />
             )}
          </div>
        </div>

        <div className="text-center md:text-left flex-1 space-y-4">
          <div className="space-y-1">
             <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/20 text-[10px] font-black uppercase tracking-[0.2em] bg-accent/30 text-primary">
               {user.role === 'admin' ? ui.admin : ui.member}
             </Badge>
             <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase italic tracking-tighter leading-none text-gradient py-2">
               {user.name}
             </h1>
          </div>
          
          <p className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-[0.3em] flex items-center justify-center md:justify-start gap-3">
             <Sparkles size={14} className="text-accent-secondary" />
             {user.email}
          </p>

          {user.bio && (
            <p className="max-w-xl text-sm font-medium text-muted-foreground leading-relaxed italic border-l-2 border-accent-secondary/30 pl-6 py-2">
              "{user.bio}"
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
