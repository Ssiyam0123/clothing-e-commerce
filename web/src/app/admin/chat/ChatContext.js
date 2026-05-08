"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuthStore } from "@/store/authStore";
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

  return (
    <ChatContext.Provider value={{ conversations, socket: socketRef.current, fetchConversations }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
