"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Send, ArrowLeft, MoreVertical, Check, CheckCheck } from "lucide-react";
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
  const customer = useMemo(() => activeConv?.participants?.find((p) => p.role === "customer"), [activeConv]);

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
    const tempMessage = {
      _id: `temp-${Date.now()}`,
      text: input,
      sender: { _id: user?._id, role: "admin" },
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setMessages((prev) => [...prev, tempMessage]);
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
    <div className="flex flex-col h-full bg-[#efeae2] dark:bg-[#0b141a] overflow-hidden">
      {/* Header */}
      <div className="h-[60px] bg-[#f0f2f5] dark:bg-[#202c33] px-4 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3 overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/chat")}
            className="lg:hidden rounded-full shrink-0"
          >
            <ArrowLeft size={20} />
          </Button>
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={getImageUrl(customer?.avatar)} />
            <AvatarFallback>{customer?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <h3 className="text-[15px] font-medium truncate">{customer?.name || "Chat"}</h3>
            <span className="text-[11px] text-[#667781] dark:text-[#8696a0]">Online</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <MoreVertical size={20} />
        </Button>
      </div>

      {/* Messages - ONLY scrollable area */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-4xl mx-auto px-4 py-4 space-y-2">
          {messages.length === 0 ? (
            <div className="text-center text-[#667781] py-10">No messages yet. Start the conversation!</div>
          ) : (
            messages.map((msg, idx) => {
              const myId = user?._id || user?.id;
              const senderId = typeof msg.sender === "string" ? msg.sender : msg.sender?._id || msg.sender?.id;
              const isMe = msg.sender?.role === "admin" || senderId === myId;
              const showStatus = idx === messages.length - 1 && isMe;
              return <ChatMessage key={msg._id || idx} message={msg} isMe={isMe} showStatus={showStatus} />;
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Bar - fixed bottom */}
      <div className="bg-[#f0f2f5] dark:bg-[#202c33] px-4 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message"
            className="flex-1 bg-white dark:bg-[#2a3942] border-none rounded-lg"
            disabled={isSending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isSending}
            size="icon"
            className="rounded-full bg-[#00a884] hover:bg-[#008f72] text-white"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}