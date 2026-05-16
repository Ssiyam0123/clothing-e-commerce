"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";

export const useChat = (isOpen) => {
  const { token, user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const socketRef = useRef(null);

  // 🚀 Fetch initial or more messages
  const fetchMessages = useCallback(async (pageNum = 1) => {
    if (!token) return;
    
    try {
      if (pageNum > 1) setIsLoadingMore(true);
      
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/my-conversation?page=${pageNum}&limit=20`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const conversation = res.data;
      if (conversation) {
        setConversationId(conversation._id);
        const newMessages = conversation.messages || [];
        
        if (pageNum === 1) {
          setMessages(newMessages);
        } else {
          // Prepend older messages
          setMessages(prev => [...newMessages, ...prev]);
        }

        // Check if more messages exist
        setHasMore(newMessages.length === 20);
      }
    } catch (err) {
      console.error("🚨 Chat Fetch Failed", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [token]);

  useEffect(() => {
    if (isOpen && token) {
      setPage(1);
      fetchMessages(1);
    }
  }, [isOpen, token, fetchMessages]);

  const loadMore = () => {
    if (hasMore && !isLoadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMessages(nextPage);
    }
  };

  useEffect(() => {
    if (isOpen && token && !socketRef.current) {
      const socketUrl = process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "");
      socketRef.current = io(socketUrl, {
        auth: { token },
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
    const data = typeof payload === "string" ? { text: payload } : payload;
    const { text, image } = data;

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("send_message", {
        text: text?.trim(),
        image,
        recipientId: "admin_room",
        conversationId,
      });
    }
  };

  return { messages, isConnected, sendMessage, conversationId, loadMore, hasMore, isLoadingMore };
};
