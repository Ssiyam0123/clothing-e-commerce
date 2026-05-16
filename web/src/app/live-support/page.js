"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useChat } from "@/hooks/useChat";
import { useAuthStore } from "@/store/authStore";
import { useAppStore } from "@/store/appStore";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Lock, MessageSquare, Shield, Clock, Zap, ArrowLeft, Heart } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/utils/imageUtils";

const ChatMessage = ({ message, isMe }) => {
  const timeStr = useMemo(() => {
    const date = new Date(message.createdAt || new Date());
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }, [message.createdAt]);

  return (
    <motion.div
      initial={{ opacity: 0, x: isMe ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn("flex w-full mb-6", isMe ? "justify-end" : "justify-start")}
    >
      <div className={cn(
        "relative max-w-[85%] sm:max-w-[65%]",
        isMe ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "px-5 py-3.5 shadow-2xl transition-all duration-500",
          isMe 
            ? "bg-gradient-to-br from-accent-secondary to-accent-secondary/80 text-white rounded-[1.5rem] rounded-tr-none border border-white/10" 
            : "bg-background/40 backdrop-blur-2xl text-foreground rounded-[1.5rem] rounded-tl-none border border-border/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)]"
        )}>
          <p className="text-[13px] md:text-[14px] leading-relaxed font-medium whitespace-pre-wrap break-words">
            {message.text}
          </p>
        </div>
        <div className={cn(
          "flex items-center gap-2 mt-2 px-2 opacity-40",
          isMe ? "justify-end" : "justify-start"
        )}>
          <span className="text-[8px] font-black uppercase tracking-widest">
            {timeStr}
          </span>
          {isMe && <div className="w-1 h-1 rounded-full bg-accent-secondary" />}
        </div>
      </div>
    </motion.div>
  );
};

export default function LiveSupportPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { messages, isConnected, sendMessage } = useChat(true);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (input.trim() && isConnected) {
      sendMessage({ text: input });
      setInput("");
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
        <div className="max-w-md w-full bg-accent/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-border/10 text-center space-y-8 shadow-2xl">
          <div className="w-24 h-24 bg-foreground rounded-[2rem] flex items-center justify-center mx-auto shadow-xl">
            <Lock size={40} className="text-background" />
          </div>
          <div className="space-y-4">
             <h1 className="text-3xl font-black uppercase italic tracking-tighter">Secure Link Required</h1>
             <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold leading-relaxed">
               Establish your identity via the Vanguard protocol to access real-time tactical support.
             </p>
          </div>
          <div className="grid gap-4">
            <Button asChild className="h-14 rounded-2xl bg-foreground text-background font-black uppercase tracking-widest text-[10px] hover:bg-accent-secondary hover:text-white transition-all shadow-xl">
              <Link href="/login?redirect=/live-support">Authorize Session</Link>
            </Button>
            <Button asChild variant="outline" className="h-14 rounded-2xl border-border/20 font-black uppercase tracking-widest text-[10px]">
              <Link href="/register">Initialize New Node</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-background overflow-hidden">
      <div className="h-full w-full flex flex-col relative">
        
        {/* Visual Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://w0.peakpx.com/wallpaper/818/148/HD-wallpaper-whatsapp-background-whatsapp-texture.jpg')] bg-repeat" />

        {/* Header */}
        <header className="h-[70px] bg-background/50 backdrop-blur-md px-6 md:px-10 flex items-center justify-between border-b border-border/10 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="rounded-full hover:bg-black/5 dark:hover:bg-white/5 mr-2"
              title="Return to Store"
            >
              <Link href="/">
                <ArrowLeft size={20} className="text-foreground/70" />
              </Link>
            </Button>

            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-accent-secondary flex items-center justify-center shadow-lg shadow-accent-secondary/20">
                <Shield size={20} className="text-white" />
              </div>
              <div className={cn(
                "absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-[3px] border-background",
                isConnected ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
              )} />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase italic tracking-tighter leading-none">Vanguard HQ</h2>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-1">
                {isConnected ? "Secure Link Active" : "Syncing Protocol..."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-6 border-r border-border/10 pr-6 mr-2">
              <div className="text-right">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Response</p>
                <p className="text-[10px] font-bold uppercase tracking-tighter">&lt; 5m</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center">
                 <Clock size={14} className="text-muted-foreground" />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500" />
               <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Live</span>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-10 no-scrollbar z-10">
          <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 md:py-32 text-center space-y-4 md:space-y-6 opacity-20">
                 <div className="w-16 h-16 md:w-24 md:h-24 bg-muted rounded-2xl md:rounded-[2rem] flex items-center justify-center">
                    <MessageSquare size={32} className="md:size-[48px]" />
                 </div>
                 <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em]">No active transmissions</p>
              </div>
            ) : (
              messages.map((msg, i) => {
                const myId = user?._id || user?.id;
                const senderId = typeof msg.sender === "string" ? msg.sender : msg.sender?._id || msg.sender?.id;
                const isMe = msg.sender?.role?.name === 'customer' || senderId === myId;
                return (
                  <ChatMessage 
                    key={msg._id || i} 
                    message={msg} 
                    isMe={isMe} 
                  />
                );
              })
            )}
            <div ref={scrollRef} />
          </div>
        </div>

        {/* Input area */}
        <footer className="p-4 md:p-8 bg-background/50 backdrop-blur-md border-t border-border/10 shrink-0 z-10">
          <div className="max-w-4xl mx-auto flex gap-2 md:gap-4">
            <div className="flex-1 relative group">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="MESSAGE..."
                className="w-full h-12 md:h-14 bg-background dark:bg-muted/50 border-border/20 rounded-xl md:rounded-2xl px-4 md:px-6 text-[12px] md:text-[13px] font-bold uppercase tracking-widest focus-visible:ring-accent-secondary/50 placeholder:text-muted-foreground/30 shadow-inner"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 hidden md:block">
                 <Zap size={16} />
              </div>
            </div>
            <Button
              onClick={handleSend}
              disabled={!input.trim() || !isConnected}
              className={cn(
                "h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl shadow-xl transition-all duration-500",
                input.trim() ? "bg-accent-secondary hover:bg-accent-secondary/90 scale-100" : "bg-muted text-muted-foreground scale-95 opacity-50"
              )}
            >
              <Send size={18} className={cn("md:size-[20px] transition-transform", input.trim() && "translate-x-0.5 -translate-y-0.5")} />
            </Button>
          </div>
          <p className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground text-center mt-4 md:mt-6 opacity-40">
            End-to-End Encryption Protocol Active
          </p>
        </footer>
      </div>
    </div>
  );
}
