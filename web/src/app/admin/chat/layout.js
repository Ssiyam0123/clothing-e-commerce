"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Home, Search, MessageSquarePlus, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/utils/imageUtils";
import { ChatProvider, useChat } from "./ChatContext";

export default function ChatLayout({ children }) {
  return (
    <ChatProvider>
      <ChatContent>{children}</ChatContent>
    </ChatProvider>
  );
}

function ChatContent({ children }) {
  const { conversations } = useChat();
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    return conversations.filter((conv) => {
      const customer = conv.participants?.find((p) => p.role === "customer");
      return customer?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [conversations, searchQuery]);

  // On mobile: when a chat is active (id exists), sidebar is hidden.
  const isMobileSidebarOpen = !id;

  return (
    <div className="flex h-screen bg-[#f0f2f5] dark:bg-[#0b141a] overflow-hidden">
      {/* Sidebar */}
      <div
        className={cn(
          "w-full lg:w-[380px] border-r border-[#d1d7db] dark:border-[#222d34] flex flex-col bg-white dark:bg-[#111b21] transition-transform duration-300 ease-in-out z-20",
          // Mobile: slide in/out based on chat active state
          "absolute lg:relative h-full shadow-xl",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Sidebar Header */}
        <div className="h-[60px] bg-[#f0f2f5] dark:bg-[#202c33] px-4 flex items-center justify-between shrink-0">
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Home size={20} />
            </Button>
          </Link>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="rounded-full">
              <MessageSquarePlus size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreVertical size={20} />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="p-2 shrink-0">
          <div className="relative flex items-center bg-[#f0f2f5] dark:bg-[#202c33] rounded-lg px-3">
            <Search size={16} />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search or start new chat"
              className="h-9 border-none bg-transparent text-sm focus-visible:ring-0"
            />
          </div>
        </div>

        {/* Conversation List */}
        <ScrollArea className="flex-1">
          <div className="divide-y divide-[#f0f2f5] dark:divide-[#202c33]">
            {filteredConversations.length === 0 && (
              <div className="py-8 text-center text-sm text-[#667781]">
                {searchQuery ? "No matching chats" : "No conversations yet"}
              </div>
            )}
            {filteredConversations.map((conv) => {
              const customer = conv.participants?.find((p) => p.role === "customer");
              const isActive = id === conv._id;
              const lastMsgTime = new Date(conv.updatedAt);

              return (
                <Link
                  key={conv._id}
                  href={`/admin/chat/${conv._id}`}
                  className={cn(
                    "w-full h-[72px] px-3 flex items-center gap-3 transition-colors block",
                    isActive
                      ? "bg-[#ebebeb] dark:bg-[#2a3942]"
                      : "hover:bg-[#f5f6f6] dark:hover:bg-[#202c33]"
                  )}
                >
                  <Avatar className="h-12 w-12 shrink-0">
                    <AvatarImage src={getImageUrl(customer?.avatar)} />
                    <AvatarFallback>
                      {customer?.name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <h3 className="font-normal truncate">{customer?.name || "Customer"}</h3>
                      <span className="text-[11px] text-[#667781]">
                        {lastMsgTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}
                      </span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <p className="text-[13px] text-[#667781] truncate">
                        {conv.lastMessage || "Click to start chatting"}
                      </p>
                      {conv.unreadCount > 0 && (
                        <Badge className="bg-[#00a884] text-white text-[11px]">
                          {conv.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Viewport - takes remaining space */}
      <div className="flex-1 relative h-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}