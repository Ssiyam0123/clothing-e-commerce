"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import { useChat } from "../ChatContext";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MoreVertical, Phone, Video, Search, User, Check, CheckCheck, Image as ImageIcon, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/utils/imageUtils";
import api from "@/lib/api";
import Link from "next/link";

const ChatMessage = ({ message, isMe, showStatus }) => {
  const timeStr = useMemo(() => {
    const date = new Date(message.createdAt || new Date());
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }, [message.createdAt]);

  const senderName = message.sender?.name;
  const isAdmin = message.sender?.role?.name === "admin" || message.sender?.role?.name === "superadmin";

  return (
    <div className={cn("flex w-full mb-3", isMe ? "justify-end" : "justify-start")}>
      <div className={cn("relative max-w-[75%]", isMe ? "items-end" : "items-start")}>
        {isAdmin && senderName && !isMe && (
          <p className="text-[10px] font-bold text-accent-secondary mb-1 px-1.5 opacity-80 uppercase tracking-tighter">
            {senderName}
          </p>
        )}
        <div className={cn(
          "overflow-hidden shadow-sm transition-all duration-200",
          isMe 
            ? "bg-[#d9fdd3] dark:bg-[#005c4b] text-[#111b21] dark:text-[#e9edef] rounded-[10px] rounded-tr-none" 
            : "bg-white dark:bg-[#202c33] text-[#111b21] dark:text-[#e9edef] rounded-[10px] rounded-tl-none border border-[#00000008] dark:border-white/5"
        )}>
          {message.image && (
            <div className="p-1">
              <img 
                src={getImageUrl(message.image)} 
                alt="Chat attachment" 
                className="max-w-full rounded-[8px] object-cover cursor-pointer hover:opacity-95 transition-opacity max-h-[400px]"
                onClick={() => window.open(getImageUrl(message.image), '_blank')}
              />
            </div>
          )}
          {message.text && (
            <div className="px-3 py-1.5 md:px-4 md:py-2">
              <p className="text-[14.2px] leading-[1.4] whitespace-pre-wrap break-words">
                {message.text}
              </p>
            </div>
          )}
          <div className="flex items-center justify-end gap-1 px-2 pb-1 opacity-50">
             <span className="text-[10px]">{timeStr}</span>
             {isMe && (
               message.isRead ? <CheckCheck size={14} className="text-[#53bdeb]" /> : <Check size={14} />
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdminChatPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const { socket, conversations, fetchConversations } = useChat();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);

  const conversation = useMemo(() => 
    conversations.find(c => c._id === id), 
    [conversations, id]
  );

  const customer = useMemo(() => 
    conversation?.participants?.find(p => p.role?.name === "customer"),
    [conversation]
  );

  useEffect(() => {
    if (!id) return;
    
    // Mark messages as read when opening the conversation
    const { resetUnread } = useChatStore.getState();
    resetUnread(id).then(() => {
      if(fetchConversations) fetchConversations();
    });

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chat/conversations/${id}/messages`);
        setMessages(res.data);
      } catch (err) {
        console.error("Transmission Intercepted", err);
      }
    };
    fetchMessages();

    if (socket) {
      const handler = (data) => {
        if (data.conversationId === id) {
          setMessages(prev => {
            const exists = prev.find(m => m._id === data.message._id);
            if (exists) return prev;
            return [...prev, data.message];
          });
          
          // Instantly mark as read if the conversation is currently active on screen
          resetUnread(id).then(() => {
            if(fetchConversations) fetchConversations();
          });
        }
      };
      const seenHandler = (data) => {
        if (data.conversationId === id) {
          setMessages(prev => prev.map(m => ({ ...m, isRead: true })));
        }
      };

      socket.on("new_message", handler);
      socket.on("messages_seen", seenHandler);
      return () => {
        socket.off("new_message", handler);
        socket.off("messages_seen", seenHandler);
      };
    }
  }, [id, socket]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (input.trim() && socket) {
      socket.emit("send_message", {
        text: input,
        conversationId: id,
        recipientId: customer?._id
      });
      setInput("");
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !socket) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await api.post("/chat/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.success) {
        socket.emit("send_message", {
          image: res.data.url,
          conversationId: id,
          recipientId: customer?._id
        });
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

  if (!conversation) return null;

  return (
    <div className="flex flex-col h-full bg-[#f0f2f5] dark:bg-[#0b141a]">
      {/* Chat Header */}
      <header className="h-[60px] bg-[#f0f2f5] dark:bg-[#202c33] px-4 flex items-center justify-between border-l border-border/5 shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-border/10">
            <AvatarImage src={getImageUrl(customer?.avatar)} className="object-cover" />
            <AvatarFallback className="bg-accent-secondary/10 text-accent-secondary font-bold">
              {customer?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h2 className="text-[15px] font-bold truncate leading-tight">{customer?.name}</h2>
            <p className="text-[11px] font-medium text-[#00a884]">Online</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-foreground/70">
            <Search size={20} />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-foreground/70">
                <MoreVertical size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl p-1.5 shadow-2xl border-border/50">
              <DropdownMenuItem asChild className="rounded-lg py-2.5 cursor-pointer">
                <Link href={`/admin/users/${customer?._id}`} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-accent-secondary/10 flex items-center justify-center text-accent-secondary">
                    <User size={16} />
                  </div>
                  <span className="font-semibold text-sm">User Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg py-2.5 cursor-pointer flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                  <Check size={16} />
                </div>
                <span className="font-semibold text-sm">Close Ticket</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar bg-[#efeae2] dark:bg-[#0b141a] relative">
         <div className="fixed inset-0 opacity-[0.06] dark:opacity-[0.03] pointer-events-none bg-[url('https://w0.peakpx.com/wallpaper/818/148/HD-wallpaper-whatsapp-background-whatsapp-texture.jpg')] bg-repeat" />
         
         <div className="max-w-4xl mx-auto space-y-1 relative z-10">
            {messages.map((msg, idx) => {
              const myId = user?._id || user?.id;
              const senderId = typeof msg.sender === "string" ? msg.sender : msg.sender?._id || msg.sender?.id;
              const isMe = senderId === myId;
              const showStatus = idx === messages.length - 1 && isMe;
              return <ChatMessage key={msg._id || idx} message={msg} isMe={isMe} showStatus={showStatus} />;
            })}
            <div ref={scrollRef} />
         </div>
      </main>

      {/* Input Area */}
      <footer className="p-3 bg-[#f0f2f5] dark:bg-[#202c33] shrink-0 z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
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
            className="rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-foreground/70 shrink-0"
          >
            {isUploading ? <Loader2 size={22} className="animate-spin text-accent-secondary" /> : <ImageIcon size={22} />}
          </Button>

          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="h-[42px] border-none bg-white dark:bg-[#2a3942] rounded-xl px-4 text-sm focus-visible:ring-0 shadow-sm"
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isUploading}
            className={cn(
              "h-[42px] w-[42px] rounded-full transition-all duration-300 shadow-md",
              input.trim() ? "bg-accent-secondary hover:bg-accent-secondary/90 scale-100" : "bg-muted text-muted-foreground scale-95 opacity-50"
            )}
          >
            <Send size={20} className={cn("transition-transform", input.trim() && "translate-x-0.5 -translate-y-0.5")} />
          </Button>
        </div>
      </footer>
    </div>
  );
}