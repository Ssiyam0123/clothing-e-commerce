"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const { token } = useAuthStore();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);

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

    socketRef.current.on("online_users", (users) => {
      setOnlineUsers(users);
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
    } finally {
      setLoading(false);
    }
  };

  const startConversation = async (participantId) => {
    try {
      // Find if conversation already exists in our local state
      const existing = conversations.find(c => 
        c.participants.some(p => String(p._id) === String(participantId))
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
      loading,
      socket: socketRef.current, 
      fetchConversations,
      startConversation,
      onlineUsers
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
