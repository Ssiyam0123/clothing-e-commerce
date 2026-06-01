"use client";

import { useChat } from "../ChatContext";
import ChatHeader from "../_components/ChatHeader";
import MessageInput from "../_components/MessageInput";
import { Loader2 } from "lucide-react";

export default function ActiveChatLayout({ children }) {
  const {
    activeConversation,
    customer,
    onlineUsers,
    input,
    setInput,
    isUploading,
    handleSend,
    handleFileChange,
    fileInputRef
  } = useChat();

  const showLoader = !activeConversation;

  return (
    <div className="flex-1 flex flex-col relative h-full overflow-hidden">
      <ChatHeader customer={customer} onlineUsers={onlineUsers} />
      
      <div className="flex-1 relative overflow-hidden">
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

