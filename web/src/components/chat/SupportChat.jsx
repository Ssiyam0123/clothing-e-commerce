"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useChat } from "@/hooks/useChat";
import { useAuthStore } from "@/store/authStore";
import { useAppStore } from "@/store/appStore";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Zap, Shield, Lock, Plus, ImageIcon, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { getImageUrl } from "@/utils/imageUtils";
import Link from "next/link";

export default function SupportChat() {
  const { user } = useAuthStore();
  const { isChatOpen: isOpen, setChatOpen: setIsOpen } = useAppStore();
  const pathname = usePathname();

  const { messages, isConnected, sendMessage, conversationId } = useChat(isOpen && !!user);
  const [localMessages, setLocalMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  console.log("🛠️ Chat State:", { isConnected, msgCount: messages.length, localCount: localMessages.length, conversationId });
  const scrollRef = useRef();
  const fileInputRef = useRef();

  // Merge server messages and local (optimistic) messages
  const allMessages = [...messages, ...localMessages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  // Sync local messages: if a server message arrives that matches a local one, remove local
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
            <div className="p-6 bg-accent-primary text-primary flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-1">
                  Tactical Support
                </span>
                <span className="text-[11px] font-black uppercase tracking-[0.1em]">
                  {user
                    ? `Link: ${isConnected ? "Active" : "Syncing"}`
                    : "Secure Link Required"}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-surface rounded-xl transition-colors"
                aria-label="Close support chat"
              >
                <X size={18} />
              </button>
            </div>

            {!user ? (
              <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-8">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="h-24 w-24 rounded-full bg-elevated dark:bg-accent-primary flex items-center justify-center border border-dashed border-medium"
                >
                  <Lock size={32} className="text-muted" />
                </motion.div>
                <div>
                  <h3 className="text-[14px] font-black uppercase tracking-[0.4em] mb-3 text-primary">
                    Authentication Required
                  </h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-secondary leading-relaxed max-w-[200px] mx-auto">
                    Establish your identity to access real-time tactical
                    support.
                  </p>
                </div>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-5 bg-accent-primary text-primary  text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/20"
                >
                  Authorize Session
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="text-[9px] font-black uppercase tracking-[0.2em] text-muted hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Initialize New Node
                </Link>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-surface-alt dark:bg-transparent">
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-20">
                    <MessageSquare size={40} className="mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">
                      No active transmissions
                    </p>
                  </div>
                )}
                {allMessages.map((msg, i) => {
                  const myId = user?._id || user?.id;
                  const senderId =
                    typeof msg.sender === "string"
                      ? msg.sender
                      : msg.sender?._id || msg.sender?.id;
                  const isMe = senderId === myId || !msg.sender; // Handle optimistic messages as "Me"
                  const senderAvatar = msg.sender?.avatar;
                  return (
                    <div
                      key={i}
                      className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex gap-3 max-w-[85%] ${isMe ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0 bg-elevated dark:bg-elevated border border-light mt-1 shadow-sm">
                          {senderAvatar ? (
                            <img
                              src={senderAvatar}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-[8px] font-black bg-accent-primary text-primary uppercase tracking-tighter">
                              {isMe ? "ME" : "HQ"}
                            </div>
                          )}
                        </div>

                        <div
                          className={`rounded-2xl text-[11px] font-bold shadow-sm leading-relaxed overflow-hidden ${
                            isMe
                              ? "bg-accent-primary text-primary  rounded-tr-none"
                              : "bg-blue-600 text-primary rounded-tl-none shadow-lg shadow-blue-500/20"
                          }`}
                        >
                          {msg.image && (
                            <div className="w-full max-w-[200px]">
                              <img 
                                src={getImageUrl(msg.image)} 
                                alt="Attachment" 
                                className="w-full h-auto object-cover border-b border-white/10"
                              />
                            </div>
                          )}
                          {msg.text && (
                            <div className="p-4">
                              {msg.text}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={scrollRef} />
              </div>
            )}

            {user && (
              <div className="p-4 bg-surface dark:bg-accent-primary/50 border-t flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setIsUploading(true);
                    const formData = new FormData();
                    formData.append("image", file);
                    try {
                      const res = await api.post("/chat/upload", formData);
                      if (res.data.success) {
                        sendMessage({ image: res.data.url });
                      }
                    } catch (err) {
                      console.error("Upload failed", err);
                    } finally {
                      setIsUploading(false);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }
                  }}
                  className="hidden"
                  accept="image/*"
                />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="p-3 bg-elevated text-secondary rounded-xl hover:text-primary transition-colors disabled:opacity-50"
                >
                  {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                </button>

                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && input.trim()) {
                      const tempMsg = {
                        sender: user?._id || user?.id,
                        text: input,
                        createdAt: new Date().toISOString(),
                        isRead: false
                      };
                      setLocalMessages(prev => [...prev, tempMsg]);
                      sendMessage({ text: input });
                      setInput("");
                    }
                  }}
                  placeholder="TRANSMIT MESSAGE..."
                  className="flex-1 bg-elevated text-[10px] font-black uppercase outline-none px-4 py-3 rounded-xl  placeholder:text-secondary"
                  disabled={isUploading}
                />
                <button
                  onClick={() => {
                    if (input.trim()) {
                      const tempMsg = {
                        sender: user?._id || user?.id,
                        text: input,
                        createdAt: new Date().toISOString(),
                        isRead: false
                      };
                      setLocalMessages(prev => [...prev, tempMsg]);
                      sendMessage({ text: input });
                      setInput("");
                    }
                  }}
                  className="p-3 bg-accent-primary text-primary  rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50"
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
