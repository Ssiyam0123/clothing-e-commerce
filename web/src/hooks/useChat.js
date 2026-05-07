"use client";

import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";

export const useChat = (isOpen) => {
  const { token, user } = useAuthStore();
  const [messages, setMessages] = useState([]);
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
          setMessages(res.data?.messages || []);
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
        // For customer, data.message contains the message object
        setMessages((prev) => [...prev, data.message]);
      });
    }

    if (!isOpen && socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [isOpen, token]);

  const sendMessage = (text) => {
    if (socketRef.current && isConnected && text.trim()) {
      socketRef.current.emit("send_message", {
        text,
        recipientId: "admin_room",
      });
    }
  };

  return { messages, isConnected, sendMessage };
};
