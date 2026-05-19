"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useChat } from "@/app/live-support/lib/useChat";
import { useAuthStore } from "@/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Lock, MessageSquare, Shield, Clock, Zap, ArrowLeft, Headphones, Image as ImageIcon, Loader2, Check, CheckCheck } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/utils/imageUtils";
import api from "@/lib/api";

const ChatMessage = ({ message, isMe }) => {
  const timeStr = useMemo(() => {
    const date = new Date(message.createdAt || new Date());
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }, [message.createdAt]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn("flex w-full mb-3 md:mb-5", isMe ? "justify-end" : "justify-start")}
    >
      <div className={cn(
        "relative max-w-[85%] sm:max-w-[75%]",
        isMe ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "overflow-hidden shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] transition-all duration-300",
          isMe 
            ? "bg-gradient-to-br from-[#0084ff] to-[#0073e6] text-white rounded-[20px] rounded-tr-[4px] shadow-[#0084ff20]" 
            : "bg-white dark:bg-[#262d31] text-foreground rounded-[20px] rounded-tl-[4px] border border-[#00000008] dark:border-white/5"
        )}>
          {message.image && (
            <div className="p-1">
              <img 
                src={getImageUrl(message.image)} 
                alt="Shared visual" 
                className="max-w-full rounded-[16px] object-cover cursor-pointer hover:opacity-95 transition-opacity max-h-[300px]"
                onClick={() => window.open(getImageUrl(message.image), '_blank')}
              />
            </div>
          )}
          {message.text && (
            <div className="px-4 py-2.5 md:px-5 md:py-3">
              <p className="text-[14px] md:text-[15px] leading-[1.5] whitespace-pre-wrap break-words font-[500]">
                {message.text}
              </p>
            </div>
          )}
        </div>
        <div className={cn(
          "flex items-center gap-1.5 mt-1 px-1 opacity-40",
          isMe ? "justify-end" : "justify-start"
        )}>
          <span className="text-[9px] font-bold uppercase tracking-widest">
            {timeStr}
          </span>
          {isMe && (
            message.isRead ? <CheckCheck size={12} className="text-[#0084ff]" /> : <Check size={12} />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function LiveSupportPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { messages, isConnected, sendMessage } = useChat(true);
  const [input, setInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim() && isConnected) {
      sendMessage({ text: input });
      setInput("");
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await api.post("/chat/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.success) {
        sendMessage({ image: res.data.url });
      }
    } catch (err) {
      console.error("Image upload failed", err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-background">
        <div className="max-w-md w-full bg-card p-10 rounded-[2.5rem] border border-border shadow-2xl text-center space-y-8">
          <div className="w-20 h-20 bg-accent-secondary/10 rounded-3xl flex items-center justify-center mx-auto">
            <Lock size={32} className="text-accent-secondary" />
          </div>
          <div className="space-y-3">
             <h1 className="text-2xl font-bold tracking-tight">Secure Login Required</h1>
             <p className="text-sm text-muted-foreground leading-relaxed px-4">
               Please log in to your account to start a real-time conversation with our support team.
             </p>
          </div>
          <div className="grid gap-3">
            <Button asChild className="h-12 rounded-xl bg-accent-secondary hover:bg-accent-secondary/90 transition-all font-semibold">
              <Link href="/login?redirect=/live-support">Sign In to Support</Link>
            </Button>
            <Button asChild variant="ghost" className="h-12 rounded-xl font-medium">
              <Link href="/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-[#f0f2f5] dark:bg-[#0b141a] overflow-hidden z-50">
      {/* Header */}
      <header className="h-[64px] bg-white dark:bg-[#202c33] px-4 md:px-8 flex items-center justify-between border-b border-border/10 shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="rounded-full hover:bg-black/5 dark:hover:bg-white/5"
          >
            <Link href="/">
              <ArrowLeft size={20} className="text-foreground/70" />
            </Link>
          </Button>

          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-accent-secondary/10 flex items-center justify-center text-accent-secondary">
              <Headphones size={22} />
            </div>
            <div className={cn(
              "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#202c33]",
              isConnected ? "bg-emerald-500" : "bg-rose-500"
            )} />
          </div>
          <div>
            <h2 className="text-[15px] font-bold leading-tight">Customer Support</h2>
            <p className="text-[11px] font-medium text-emerald-500">
              {isConnected ? "Agent is available" : "Connecting..."}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-muted-foreground">
          <div className="text-right">
             <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Avg Response</p>
             <p className="text-[11px] font-semibold text-foreground">Under 5 mins</p>
          </div>
          <div className="w-[1px] h-8 bg-border/20" />
          <Clock size={18} className="opacity-40" />
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar relative z-10">
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.02] pointer-events-none bg-[url('https://w0.peakpx.com/wallpaper/818/148/HD-wallpaper-whatsapp-background-whatsapp-texture.jpg')] bg-repeat" />
        
        <div className="max-w-3xl mx-auto space-y-2 relative z-10">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-30">
               <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center">
                  <MessageSquare size={32} />
               </div>
               <p className="text-sm font-medium tracking-wide">How can we help you today?</p>
            </div>
          ) : (
            messages.map((msg, i) => {
              const myId = user?._id || user?.id;
              const senderId = typeof msg.sender === "string" ? msg.sender : msg.sender?._id || msg.sender?.id;
              const isMe = msg.sender?.role?.name === 'customer' || senderId === myId;
              return <ChatMessage key={msg._id || i} message={msg} isMe={isMe} />;
            })
          )}
          <div ref={scrollRef} />
        </div>
      </main>

      {/* Input area */}
      <footer className="p-3 md:p-6 bg-white dark:bg-[#202c33] border-t border-border/10 shrink-0 z-20 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
        <div className="max-w-3xl mx-auto flex items-center gap-2 md:gap-4">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="h-11 w-11 md:h-12 md:w-12 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground shrink-0"
          >
            {isUploading ? <Loader2 size={20} className="animate-spin text-accent-secondary" /> : <ImageIcon size={20} />}
          </Button>

          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="w-full h-11 md:h-12 bg-[#f0f2f5] dark:bg-[#2a3942] border-none rounded-2xl px-4 md:px-5 text-[14px] md:text-[15px] focus-visible:ring-0 placeholder:text-muted-foreground/50 shadow-inner"
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={!input.trim() || !isConnected}
            className={cn(
              "h-11 w-11 md:h-12 md:w-12 rounded-full shadow-md transition-all duration-300",
              input.trim() ? "bg-accent-secondary hover:bg-accent-secondary/90 scale-100" : "bg-muted text-muted-foreground scale-95 opacity-50"
            )}
          >
            <Send size={18} className={cn("transition-transform", input.trim() && "translate-x-0.5 -translate-y-0.5")} />
          </Button>
        </div>
      </footer>
    </div>
  );
}
