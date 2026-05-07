"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useChat } from "@/hooks/useChat";
import { useAuthStore } from "@/store/authStore";
import { useAppStore } from "@/store/appStore";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Zap, Shield, Lock } from "lucide-react";
import Link from "next/link";

export default function SupportChat() {
  const { user } = useAuthStore();
  const { isChatOpen: isOpen, setChatOpen: setIsOpen } = useAppStore();
  const pathname = usePathname();

  const { messages, isConnected, sendMessage } = useChat(isOpen && !!user);
  const [input, setInput] = useState("");
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
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
                {messages.map((msg, i) => {
                  const myId = user?._id || user?.id;
                  const senderId =
                    typeof msg.sender === "string"
                      ? msg.sender
                      : msg.sender?._id || msg.sender?.id;
                  const isMe = senderId === myId;
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
                          className={`p-4 rounded-2xl text-[11px] font-bold shadow-sm leading-relaxed ${
                            isMe
                              ? "bg-accent-primary text-primary  rounded-tr-none"
                              : "bg-blue-600 text-primary rounded-tl-none shadow-lg shadow-blue-500/20"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={scrollRef} />
              </div>
            )}

            {user && (
              <div className="p-4 bg-surface dark:bg-accent-primary/50 border-t flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    input.trim() &&
                    (sendMessage(input), setInput(""))
                  }
                  placeholder="TRANSMIT MESSAGE..."
                  className="flex-1 bg-elevated text-[10px] font-black uppercase outline-none px-4 py-3 rounded-xl  placeholder:text-secondary"
                />
                <button
                  onClick={() => {
                    if (input.trim()) {
                      sendMessage(input);
                      setInput("");
                    }
                  }}
                  className="p-3 bg-accent-primary text-primary  rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg"
                  aria-label="Send message"
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
