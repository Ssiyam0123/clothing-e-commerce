"use client";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  User,
  MessageCircle,
  Clock,
  Check,
  CheckCheck,
  Shield,
} from "lucide-react";

/**
 * 🛡️ Vanguard Command Center: Live Support Interface
 * Real-time tactical communications with customers
 */
export default function AdminChat() {
  const { token, user } = useAuthStore();
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const socketRef = useRef();
  const scrollRef = useRef();

  useEffect(() => {
    if (!token) return;

    // Initialize Socket Protocol
    socketRef.current = io(
      process.env.NEXT_PUBLIC_API_URL.replace("/api", ""),
      {
        auth: { token },
        transports: ["websocket"],
      },
    );

    socketRef.current.on("connect", () =>
      console.log("🛡️ Command Center: Link Established"),
    );

    socketRef.current.on("new_message", (data) => {
      // Refresh list to update last message/order
      fetchConversations();

      // If the message belongs to the current active session, append it
      if (selectedConv?._id === data.conversationId) {
        setMessages((prev) => [...prev, data.message]);
      }
    });

    fetchConversations();

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [token, selectedConv?._id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await api.get("/chat/conversations");
      if (res.data.success) {
        setConversations(res.data.conversations);
      }
    } catch (err) {
      console.error(
        "📡 Intelligence Failure: Could not sync conversations",
        err,
      );
    }
  };

  const selectConversation = async (conv) => {
    setSelectedConv(conv);
    setIsLoadingMessages(true);
    try {
      const res = await api.get(`/chat/conversations/${conv._id}/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error(
        "📡 Intelligence Failure: Could not retrieve message logs",
        err,
      );
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSendMessage = () => {
    if (!input.trim() || !selectedConv) return;

    // Target the customer in the participant list
    const customer = selectedConv.participants.find(
      (p) => p.role === "customer",
    );
    if (!customer) return;

    socketRef.current.emit("send_message", {
      text: input,
      recipientId: customer._id,
    });
    setInput("");
  };

  return (
    <div className="flex h-[calc(100vh-140px)] bg-white dark:bg-black rounded-[2.5rem] border border-zinc-200 dark:border-white/5 overflow-hidden shadow-2xl transition-all duration-500">
      {/* 📂 Tactical Sidebar */}
      <div className="w-80 border-r border-zinc-200 dark:border-white/5 flex flex-col bg-zinc-50/50 dark:bg-[#080808] backdrop-blur-3xl">
        <div className="p-8 border-b border-zinc-200 dark:border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <Shield size={14} className="text-zinc-400" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
              Comms Hub
            </h2>
          </div>
          <p className="text-xl font-black uppercase italic tracking-tighter">
            Frequencies
          </p>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2">
          {conversations.length > 0 ? (
            conversations.map((conv) => {
              const customer = conv.participants.find(
                (p) => p.role === "customer",
              );
              const isActive = selectedConv?._id === conv._id;
              return (
                <motion.button
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  key={conv._id}
                  onClick={() => selectConversation(conv)}
                  className={`w-full p-5 rounded-[1.5rem] flex items-center gap-4 transition-all duration-300 ${
                    isActive
                      ? "bg-zinc-900 text-white shadow-2xl shadow-black/40 ring-1 ring-white/10"
                      : "hover:bg-white dark:hover:bg-zinc-900/50 group"
                  }`}
                >
                  <div
                    className={`h-12 w-12 rounded-full flex items-center justify-center overflow-hidden border-2 transition-colors ${
                      isActive
                        ? "border-white/20"
                        : "border-zinc-200 dark:border-white/5 group-hover:border-zinc-300"
                    }`}
                  >
                    {customer?.avatar ? (
                      <img
                        src={customer.avatar}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User
                        size={20}
                        className={isActive ? "text-zinc-400" : "text-zinc-500"}
                      />
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-[11px] font-black uppercase tracking-wider truncate">
                        {customer?.name || "Unknown"}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="h-4 min-w-[1rem] px-1 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center animate-pulse">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-[10px] font-medium truncate opacity-60 ${isActive ? "text-zinc-300" : "text-zinc-500"}`}
                    >
                      {conv.lastMessage || "Link Standby..."}
                    </p>
                  </div>
                </motion.button>
              );
            })
          ) : (
            <div className="p-8 text-center opacity-30">
              <p className="text-[10px] font-black uppercase tracking-widest italic">
                No Active Frequencies
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 💬 Main Transmission Deck */}
      <div className="flex-1 flex flex-col bg-white dark:bg-[#050505]">
        {selectedConv ? (
          <>
            {/* Header */}
            <div className="px-8 py-6 border-b border-zinc-200 dark:border-white/5 flex justify-between items-center bg-white/80 dark:bg-black/80 backdrop-blur-xl z-10">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center overflow-hidden border border-zinc-200 dark:border-white/5 shadow-inner">
                    {selectedConv.participants.find(
                      (p) => p.role === "customer",
                    )?.avatar ? (
                      <img
                        src={
                          selectedConv.participants.find(
                            (p) => p.role === "customer",
                          ).avatar
                        }
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User size={24} className="text-zinc-500" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-4 border-white dark:border-[#050505] rounded-full shadow-sm" />
                </div>
                <div>
                  <h3 className="text-[13px] font-black uppercase tracking-[0.2em]">
                    {
                      selectedConv.participants.find(
                        (p) => p.role === "customer",
                      )?.name
                    }
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-black text-green-500 uppercase tracking-widest italic">
                      Live Transmission Active
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-white/5">
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                    ID: {selectedConv._id.slice(-8)}
                  </span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-8 py-10 space-y-8 no-scrollbar bg-zinc-50/30 dark:bg-transparent">
              <AnimatePresence mode="popLayout">
                {messages.map((msg, idx) => {
                  const myId = user?._id || user?.id;
                  const senderId =
                    typeof msg.sender === "string"
                      ? msg.sender
                      : msg.sender?._id || msg.sender?.id;
                  const isMe =
                    msg.sender?.role === "admin" || senderId === myId;
                  const senderAvatar = msg.sender?.avatar;
                  return (
                    <motion.div
                      initial={{ opacity: 0, x: isMe ? 20 : -20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      key={idx}
                      className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex gap-4 max-w-[70%] ${isMe ? "flex-row-reverse" : "flex-row"}`}
                      >
                        {/* 🛰️ Avatar Node */}
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden border border-zinc-200 dark:border-white/5 mt-1 shadow-sm">
                          {senderAvatar ? (
                            <img
                              src={senderAvatar}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-zinc-400 bg-zinc-50 dark:bg-zinc-800">
                              <User size={18} />
                            </div>
                          )}
                        </div>

                        {/* 💬 Bubble and Metadata */}
                        <div
                          className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                        >
                          <div
                            className={`p-5 rounded-[2rem] text-[11px] font-bold leading-relaxed shadow-sm transition-all hover:shadow-xl ${
                              isMe
                                ? "bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-500/20"
                                : "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-tl-none border border-zinc-200 dark:border-white/5"
                            }`}
                          >
                            {msg.text}
                          </div>
                          <div
                            className={`flex items-center gap-3 mt-3 px-1 ${isMe ? "flex-row-reverse" : ""}`}
                          >
                            <span className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {isMe &&
                              (msg.isRead ? (
                                <CheckCheck
                                  size={12}
                                  className="text-blue-500"
                                />
                              ) : (
                                <Check size={12} className="text-zinc-400" />
                              ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={scrollRef} />
            </div>

            {/* Input */}
            <div className="p-8 bg-white/50 dark:bg-black/50 backdrop-blur-3xl border-t border-zinc-200 dark:border-white/5">
              <div className="relative flex items-center gap-5">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="AUTHORIZE TRANSMISSION..."
                  className="flex-1 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-[1.5rem] px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] outline-none focus:ring-2 ring-zinc-900/10 dark:ring-white/10 focus:border-zinc-900 dark:focus:border-white transition-all shadow-inner"
                />
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  className="h-16 w-16 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-black/20"
                >
                  <Send size={22} />
                </motion.button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 space-y-8 p-12">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
              className="h-32 w-32 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center border-2 border-dashed border-zinc-300 dark:border-white/10"
            >
              <MessageCircle size={48} className="opacity-40" />
            </motion.div>
            <div className="text-center max-w-sm">
              <p className="text-[14px] font-black uppercase tracking-[0.5em] mb-4 text-zinc-900 dark:text-zinc-100">
                Frequency Idle
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed opacity-40">
                Satellite link established. Waiting for frequency selection to
                begin tactical communication protocols.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
