"use client";

import { useChat } from "../ChatContext";
import ChatHeader from "../_components/ChatHeader";
import MessageInput from "../_components/MessageInput";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

export default function ActiveChatLayout({ children }) {
  const { id } = useParams();
  const {
    activeConversation,
    messagesLoading,
    customer,
    onlineUsers,
    input,
    setInput,
    isUploading,
    handleSend,
    handleFileChange,
    fileInputRef
  } = useChat();

  const isActiveConversationReady = activeConversation?._id === id;
  const showLoader = !isActiveConversationReady || messagesLoading;

  return (
    <div className="grid h-full min-h-0 grid-rows-[60px_minmax(0,1fr)_auto] overflow-hidden">
      <ChatHeader customer={customer} onlineUsers={onlineUsers} />
      
      <div className="relative min-h-0 overflow-hidden">
        {showLoader ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#efeae2] dark:bg-[#0b141a]">
            <Loader2 className="h-8 w-8 animate-spin text-accent-secondary" />
          </div>
        ) : (
          children
        )}
      </div>

      <MessageInput 
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        handleFileChange={handleFileChange}
        isUploading={isUploading}
        fileInputRef={fileInputRef}
      />
    </div>
  );
}
