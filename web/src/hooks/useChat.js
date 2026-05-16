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
      const socketUrl = process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "");
      socketRef.current = io(socketUrl, {
        auth: { token },
        // transports: ["websocket"], // Allow fallback to polling for better reliability
      });

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

  const sendMessage = (payload) => {
    // 🛡️ Backward Compatibility: If payload is a string, convert to object
    const data = typeof payload === "string" ? { text: payload } : payload;
    const { text, image } = data;

    console.log("🚀 Socket Emit Attempt:", { text, image, isConnected: socketRef.current?.connected });
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("send_message", {
        text: text?.trim(),
        image,
        recipientId: "admin_room",
        conversationId: conversationId,
      });
    } else {
      console.warn("🚨 Socket not connected or socketRef missing");
    }
  };

  return { messages, isConnected, sendMessage, conversationId };
};
