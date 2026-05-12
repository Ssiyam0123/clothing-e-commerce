"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Send, ArrowLeft, MoreVertical, Check, CheckCheck, Search } from "lucide-react";
import { useChat } from "../ChatContext";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/utils/imageUtils";

const ChatMessage = ({ message, isMe, showStatus }) => {
  const timeStr = useMemo(
    () =>
      new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    [message.createdAt]
  );

  return (
    <div className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "relative px-3 py-2 max-w-[85%] lg:max-w-[65%] shadow-sm break-words",
          isMe
            ? "bg-[#d9fdd3] dark:bg-[#005c4b] rounded-lg rounded-tr-none"
            : "bg-white dark:bg-[#202c33] rounded-lg rounded-tl-none"
        )}
      >
        <p className="text-[14.2px] leading-relaxed whitespace-pre-wrap break-words pr-12">
          {message.text}
        </p>
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-[11px] text-[#667781] dark:text-[#8696a0]">
            {timeStr}
          </span>
          {isMe && showStatus && (
            message.isRead ? <CheckCheck size={14} className="text-[#53bdeb]" /> : <Check size={14} className="text-[#8696a0]" />
          )}
        </div>
      </div>
    </div>
  );
};

export default function ActiveChatPage() {
  const { id } = useParams();
  const router = useRouter();
  const { socket, conversations, markConversationRead } = useChat();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const activeConv = useMemo(() => conversations.find((c) => c._id === id), [conversations, id]);
  const customer = useMemo(() => activeConv?.participants?.find((p) => p.role?.name === "customer"), [activeConv]);

  // Fetch messages
  useEffect(() => {
    if (!id) return;
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/chat/conversations/${id}/messages`);
        setMessages(res.data || []);
        if (markConversationRead) markConversationRead(id);
      } catch (err) {
        console.error("Failed to load messages", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, [id, markConversationRead]);

  // Socket listener
  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (data) => {
      if (data.conversationId === id) {
        setMessages((prev) => [...prev, data.message]);
        setTimeout(() => scrollToBottom(), 100);
      }
    };
    socket.on("new_message", handleNewMessage);
    return () => socket.off("new_message", handleNewMessage);
  }, [socket, id]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!isLoading) scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || !socket || !customer || isSending) return;
    setIsSending(true);
    socket.emit("send_message", {
      text: input,
      recipientId: customer._id,
      conversationId: id,
    });
    setInput("");
    setIsSending(false);
  }, [input, socket, customer, id, user, isSending]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#efeae2] dark:bg-[#0b141a]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00a884]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#efeae2] dark:bg-[#0b141a] overflow-hidden relative">
      {/* Visual Background Pattern - WhatsApp style */}
      <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03] pointer-events-none bg-[url('https://w0.peakpx.com/wallpaper/818/148/HD-wallpaper-whatsapp-background-whatsapp-texture.jpg')] bg-repeat" />

      {/* Header */}
      <div className="h-[56px] md:h-[60px] bg-[#f0f2f5] dark:bg-[#202c33] px-2 md:px-4 flex items-center justify-between shrink-0 shadow-sm z-10 border-b border-border/5">
        <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/chat")}
            className="lg:hidden rounded-full shrink-0 hover:bg-black/5 dark:hover:bg-white/5 w-9 h-9"
          >
            <ArrowLeft size={18} className="text-foreground/70" />
          </Button>
          
          <div className="relative shrink-0">
            <Avatar className="h-9 w-9 md:h-10 md:w-10 border border-border/10 shadow-sm">
              <AvatarImage src={getImageUrl(customer?.avatar)} className="object-cover" />
              <AvatarFallback className="bg-accent-secondary/10 text-accent-secondary font-bold text-xs">
                {customer?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#f0f2f5] dark:border-[#202c33] rounded-full" />
          </div>

          <div className="flex flex-col min-w-0">
            <h3 className="text-[14px] md:text-[15px] font-bold text-foreground/90 truncate leading-tight">
              {customer?.name || "Anonymous_User"}
            </h3>
            <span className="text-[10px] text-[#00a884] font-medium animate-pulse">Online</span>
          </div>
        </div>
        
        <div className="flex items-center gap-0.5 md:gap-1">
          <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full hover:bg-black/5 dark:hover:bg-white/5">
            <Search size={16} className="text-foreground/60" />
          </Button>
          <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full hover:bg-black/5 dark:hover:bg-white/5">
            <MoreVertical size={18} className="text-foreground/60" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto min-h-0 z-10 no-scrollbar">
        <div className="max-w-4xl mx-auto px-3 md:px-4 py-4 md:py-6 space-y-2 md:space-y-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-30">
               <div className="w-16 h-16 md:w-20 md:h-20 bg-muted rounded-full flex items-center justify-center">
                  <Send size={24} className="md:size-[32px]" />
               </div>
               <p className="text-xs md:text-sm font-medium uppercase tracking-widest">No transmissions</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const myId = user?._id || user?.id;
              const senderId = typeof msg.sender === "string" ? msg.sender : msg.sender?._id || msg.sender?.id;
              const isMe = msg.sender?.role?.name === "admin" || senderId === myId;
              const showStatus = idx === messages.length - 1 && isMe;
              return <ChatMessage key={msg._id || idx} message={msg} isMe={isMe} showStatus={showStatus} />;
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Bar */}
      <div className="bg-[#f0f2f5] dark:bg-[#202c33] px-2 md:px-4 py-2 md:py-3 shrink-0 z-10 border-t border-border/5">
        <div className="flex items-center gap-2 md:gap-3 max-w-5xl mx-auto">
          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message..."
              className="w-full h-10 md:h-11 bg-white dark:bg-[#2a3942] border-none rounded-xl px-3 md:px-4 py-1.5 md:py-2 text-[14px] md:text-[15px] focus-visible:ring-0 shadow-sm"
              disabled={isSending}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isSending}
            size="icon"
            className={cn(
              "rounded-xl h-10 w-10 md:h-11 md:w-11 shadow-lg transition-all duration-300",
              input.trim() ? "bg-[#00a884] hover:bg-[#008f72] scale-100" : "bg-muted text-muted-foreground scale-95 opacity-50"
            )}
          >
            <Send size={16} className={cn("md:size-[18px] transition-transform", input.trim() && "translate-x-0.5 -translate-y-0.5")} />
          </Button>
        </div>
      </div>
    </div>
  );
}