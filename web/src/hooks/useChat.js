"use client";

import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";

export const useChat = (isOpen) => {
  const { token, user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (isOpen && token) {
      const fetchHistory = async () => {
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/chat/my-conversation`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          if (res.data?.success) {
            setMessages(res.data.conversation?.messages || []);
            setConversationId(res.data.conversation?._id);
          } else {
            // Fallback for different API structure
            setMessages(res.data?.messages || []);
            setConversationId(res.data?._id || res.data?.conversationId);
          }
        } catch (err) {
          console.error("🚨 History Sync Failed", err);
        }
      };
      fetchHistory();
    }
  }, [isOpen, token]);

  useEffect(() => {
    if (isOpen && token && !socketRef.current) {
      socketRef.current = io(
        process.env.NEXT_PUBLIC_API_URL.replace("/api", ""),
        {
          auth: { token },
          transports: ["websocket"],
        },
      );

      socketRef.current.on("connect", () => setIsConnected(true));
      socketRef.current.on("disconnect", () => setIsConnected(false));

      socketRef.current.on("new_message", (data) => {
        setMessages((prev) => [...prev, data.message]);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isOpen, token]);

  const sendMessage = (text) => {
    if (socketRef.current && isConnected && text.trim()) {
      socketRef.current.emit("send_message", {
        text,
        recipientId: "admin_room",
        conversationId, // Include conversationId for backend routing
      });
    }
  };

  return { messages, isConnected, sendMessage, conversationId };
};
