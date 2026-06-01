"use client";

import { useChat } from "../ChatContext";
import ChatHeader from "../_components/ChatHeader";
import MessageInput from "../_components/MessageInput";

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

  if (!activeConversation) return null;

  return (
    <div className="flex-1 flex flex-col relative h-full overflow-hidden">
      <ChatHeader customer={customer} onlineUsers={onlineUsers} />
      
      <div className="flex-1 relative overflow-hidden">
        {children}
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
