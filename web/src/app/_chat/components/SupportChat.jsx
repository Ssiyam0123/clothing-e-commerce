"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useChat } from "@/app/_chat/lib/useChat";
import { useAuthStore } from "@/store/authStore";
import { useAppStore } from "@/store/appStore";
import { useChatStore } from "@/store/chatStore";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Plus, Loader2, ArrowUpCircle, Check, CheckCheck } from "lucide-react";
import api from "@/lib/api";
import { getImageUrl } from "@/utils/imageUtils";
import Link from "next/link";

export default function SupportChat() {
  const { user } = useAuthStore();
  const { isChatOpen: isOpen, setChatOpen: setIsOpen } = useAppStore();

  const pathname = usePathname();

  const { 
    messages, 
    isConnected, 
    sendMessage, 
    conversationId, 
    loadMore, 
    hasMore, 
    isLoadingMore 
  } = useChat(isOpen && !!user);
  
  const [localMessages, setLocalMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);



  const scrollRef = useRef();
  const topObserverRef = useRef();
  const fileInputRef = useRef();

  const allMessages = [...messages, ...localMessages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  // 🚀 Auto-scroll to bottom only for new messages
  useEffect(() => {
    if (!isLoadingMore) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessages.length, isLoadingMore]);

  // 🛰️ Intersection Observer for Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.5 }
    );

    if (topObserverRef.current) {
      observer.observe(topObserverRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, loadMore]);

  // Sync local messages
  useEffect(() => {
    if (messages.length > 0) {
      setLocalMessages(prev => prev.filter(local => 
        !messages.some(msg => 
          (msg.text === local.text && msg.image === local.image && Math.abs(new Date(msg.createdAt) - new Date(local.createdAt)) < 5000)
        )
      ));
    }
  }, [messages]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[9999] pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[95vw] sm:w-[24rem] h-[calc(100vh-12rem)] max-h-[600px] bg-surface dark:bg-[#0a0a0a] border border-light rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden mb-4 pointer-events-auto"
          >
            {/* Header */}
            <div className="p-6 bg-accent-primary text-primary flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-1">
                  Tactical Support
                </span>
                <span className="text-[11px] font-black uppercase tracking-[0.1em]">
                  {user ? `Link: ${isConnected ? "Active" : "Syncing"}` : "Secure Link Required"}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-surface rounded-xl transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {!user ? (
              <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-8">
                {/* Login Prompt UI (Keep existing) */}
                <div className="h-24 w-24 rounded-full bg-elevated dark:bg-accent-primary flex items-center justify-center border border-dashed border-medium">
                  <MessageSquare size={32} className="text-muted" />
                </div>
                <Link href="/login" onClick={() => setIsOpen(false)} className="w-full py-5 bg-accent-primary text-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl">
                  Authorize Session
                </Link>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-surface-alt dark:bg-transparent scroll-smooth">
                {/* 🛰️ Top Observer & Loading State */}
                <div ref={topObserverRef} className="h-4 w-full flex items-center justify-center py-4">
                  {isLoadingMore ? (
                    <Loader2 size={16} className="animate-spin text-accent-primary" />
                  ) : hasMore ? (
                    <ArrowUpCircle size={14} className="text-muted opacity-30" />
                  ) : (
                    <span className="text-[8px] font-black uppercase tracking-widest text-muted opacity-20">Beginning of Transmission</span>
                  )}
                </div>

                {allMessages.length === 0 && !isLoadingMore && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-20">
                    <MessageSquare size={40} className="mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">No active transmissions</p>
                  </div>
                )}

                {allMessages.map((msg, i) => {
                  const myId = user?._id || user?.id;
                  const senderId = typeof msg.sender === "string" ? msg.sender : msg.sender?._id || msg.sender?.id;
                  const isMe = senderId === myId || !msg.sender;
                  
                  return (
                    <div key={msg._id || i} className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`flex gap-3 max-w-[85%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                        <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0 bg-elevated border border-light mt-1 shadow-sm">
                          {msg.sender?.avatar ? (
                            <img src={msg.sender.avatar} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-[8px] font-black bg-accent-primary text-primary uppercase">
                              {isMe ? "ME" : "HQ"}
                            </div>
                          )}
                        </div>

                        <div className={`relative rounded-2xl text-[11px] font-bold shadow-sm leading-relaxed overflow-hidden ${isMe ? "bg-accent-primary text-primary rounded-tr-none" : "bg-blue-600 text-primary rounded-tl-none shadow-lg shadow-blue-500/20"}`}>
                          {msg.image && (
                            <div className="w-full max-w-[200px]">
                              <img src={getImageUrl(msg.image)} alt="Attachment" className="w-full h-auto object-cover border-b border-white/10" />
                            </div>
                          )}
                          {msg.text && <div className="p-3 md:p-4">{msg.text}</div>}
                          
                          <div className={`flex items-center gap-1 px-3 pb-2 opacity-50 ${isMe ? "justify-end text-primary" : "justify-start text-primary"}`}>
                             <span className="text-[9px] uppercase tracking-widest">{msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                             {isMe && (
                               msg.isRead ? <CheckCheck size={12} className="text-[#53bdeb]" /> : <Check size={12} />
                             )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={scrollRef} />
              </div>
            )}

            {/* Input Footer */}
            {user && (
              <div className="p-4 bg-surface dark:bg-accent-primary/50 border-t flex items-center gap-2">
                <input type="file" ref={fileInputRef} onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setIsUploading(true);
                  const formData = new FormData();
                  formData.append("image", file);
                  try {
                    const res = await api.post("/chat/upload", formData);
                    if (res.data.success) sendMessage({ image: res.data.url });
                  } catch (err) { console.error(err); } 
                  finally { 
                    setIsUploading(false); 
                    if (fileInputRef.current) fileInputRef.current.value = ""; 
                  }
                }} className="hidden" accept="image/*" />
                
                <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="p-3 bg-elevated text-secondary rounded-xl hover:text-primary disabled:opacity-50">
                  {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                </button>

                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && input.trim()) {
                      const tempMsg = { sender: user?._id || user?.id, text: input, createdAt: new Date().toISOString() };
                      setLocalMessages(prev => [...prev, tempMsg]);
                      sendMessage({ text: input });
                      setInput("");
                    }
                  }}
                  placeholder="TRANSMIT MESSAGE..."
                  className="flex-1 bg-elevated text-[10px] font-black uppercase outline-none px-4 py-3 rounded-xl"
                />
                <button
                  onClick={() => {
                    if (input.trim()) {
                      const tempMsg = { sender: user?._id || user?.id, text: input, createdAt: new Date().toISOString() };
                      setLocalMessages(prev => [...prev, tempMsg]);
                      sendMessage({ text: input });
                      setInput("");
                    }
                  }}
                  className="p-3 bg-accent-primary text-primary rounded-xl shadow-lg disabled:opacity-50"
                  disabled={!input.trim() || isUploading}
                >
                  <Send size={16} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
