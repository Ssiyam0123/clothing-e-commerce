"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useAuthStore } from "@/store/authStore";
import { useChat } from "../ChatContext";
import { MoreVertical, Check, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/utils/imageUtils";

const ChatMessage = ({ message, isMe, showStatus, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editVal, setEditVal] = useState(message.text || "");

  const timeStr = useMemo(() => {
    const date = new Date(message.createdAt || new Date());
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }, [message.createdAt]);

  const senderName = message.sender?.name;
  const isAdmin = message.sender?.role?.name === "admin" || message.sender?.role?.name === "superadmin";

  return (
    <div className={cn("flex w-full mb-3", isMe ? "justify-end" : "justify-start")}>
      <div className={cn("relative max-w-[75%] flex items-center gap-1 group", isMe ? "flex-row-reverse" : "flex-row")}>
        {/* Dropdown Menu Trigger (Shows on Hover) */}
        {isMe && !isEditing && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-black/5 dark:hover:bg-white/5">
                  <MoreVertical size={14} className="text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-24 rounded-lg shadow-md">
                {message.text && (
                  <DropdownMenuItem className="cursor-pointer font-medium text-xs py-2" onClick={() => setIsEditing(true)}>
                    Edit
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive font-medium text-xs py-2" onClick={() => onDelete(message._id)}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        <div className={cn("relative flex flex-col", isMe ? "items-end" : "items-start")}>
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
            
            {isEditing ? (
              <div className="p-2 flex items-center gap-1 bg-white dark:bg-[#202c33] min-w-[200px]">
                <Input 
                  value={editVal} 
                  onChange={(e) => setEditVal(e.target.value)} 
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onEdit(message._id, editVal);
                      setIsEditing(false);
                    } else if (e.key === "Escape") {
                      setIsEditing(false);
                    }
                  }}
                  className="h-8 py-1 text-xs focus-visible:ring-1 focus-visible:ring-accent-secondary"
                  autoFocus
                />
                <Button size="sm" variant="ghost" className="h-8 px-2 text-xs font-bold text-accent-secondary" onClick={() => {
                  onEdit(message._id, editVal);
                  setIsEditing(false);
                }}>Save</Button>
                <Button size="sm" variant="ghost" className="h-8 px-2 text-xs text-muted-foreground" onClick={() => setIsEditing(false)}>Cancel</Button>
              </div>
            ) : (
              message.text && (
                <div className="px-3 py-1.5 md:px-4 md:py-2">
                  <p className="text-[14.2px] leading-[1.4] whitespace-pre-wrap break-words">
                    {message.text}
                  </p>
                </div>
              )
            )}
            
            <div className="flex items-center justify-end gap-1 px-2 pb-1 opacity-50">
               {message.isEdited && <span className="text-[9px] italic mr-1">edited</span>}
               <span className="text-[10px]">{timeStr}</span>
               {isMe && (
                 message.isRead ? <CheckCheck size={14} className="text-[#53bdeb]" /> : <Check size={14} />
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdminChatPage() {
  const { user } = useAuthStore();
  const { 
    activeConversation, 
    messages, 
    handleEditMessage, 
    handleDeleteMessage 
  } = useChat();
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!activeConversation) return null;

  return (
    <div id="admin-chat-detail-container" className="relative w-full h-full flex flex-col bg-[#f0f2f5] dark:bg-[#0b141a] overflow-hidden">
      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar bg-[#efeae2] dark:bg-[#0b141a] relative">
         <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.03] pointer-events-none bg-[url('https://w0.peakpx.com/wallpaper/818/148/HD-wallpaper-whatsapp-background-whatsapp-texture.jpg')] bg-repeat" />
         
         <div className="max-w-4xl mx-auto space-y-1 relative z-10">
            {messages.map((msg, idx) => {
              const myId = user?._id || user?.id;
              const senderId = typeof msg.sender === "string" ? msg.sender : msg.sender?._id || msg.sender?.id;
              const isMe = senderId === myId;
              const showStatus = idx === messages.length - 1 && isMe;
              return (
                <ChatMessage 
                  key={msg._id || idx} 
                  message={msg} 
                  isMe={isMe} 
                  showStatus={showStatus} 
                  onEdit={handleEditMessage}
                  onDelete={handleDeleteMessage}
                />
              );
            })}
            <div ref={scrollRef} />
         </div>
      </main>
    </div>
  );
}