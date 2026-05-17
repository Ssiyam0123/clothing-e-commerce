"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuthStore } from "@/modules/client/auth/lib/authStore";
import api from "@/lib/api";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const { token } = useAuthStore();
  const [conversations, setConversations] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    if (!token) return;

    socketRef.current = io(
      process.env.NEXT_PUBLIC_API_URL.replace("/api", ""),
      {
        auth: { token },
        transports: ["websocket"],
      },
    );

    socketRef.current.on("new_message", (data) => {
      fetchConversations();
    });

    fetchConversations();

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [token]);

  const fetchConversations = async () => {
    try {
      const res = await api.get("/chat/conversations");
      if (res.data.success) {
        setConversations(res.data.conversations);
      }
    } catch (err) {
      console.error("📡 Intelligence Failure", err);
    }
  };

  const startConversation = async (participantId) => {
    try {
      // Find if conversation already exists in our local state
      const existing = conversations.find(c => 
        c.participants.some(p => p._id === participantId)
      );

      if (existing) return existing._id;

      // If not in local state (might be filtered out because no messages), 
      // request backend to find or create
      const res = await api.post("/chat/conversations/start", { participantId });
      if (res.data.success) {
        await fetchConversations();
        return res.data.conversation._id;
      }
    } catch (err) {
      console.error("Failed to start conversation", err);
    }
  };

  return (
    <ChatContext.Provider value={{ 
      conversations, 
      socket: socketRef.current, 
      fetchConversations,
      startConversation 
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
