import { useEffect, useState, useRef, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import api from "@/lib/api";

export const useChat = (isOpen) => {
  const { token, user } = useAuthStore();
  const { socket, fetchConversations } = useChatStore();
  
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // 🚀 Fetch initial or more messages
  const fetchMessages = useCallback(async (pageNum = 1) => {
    if (!token) return;
    
    try {
      if (pageNum > 1) setIsLoadingMore(true);
      
      const res = await api.get(`/chat/my-conversation?page=${pageNum}&limit=20`);

      const conversation = res.data;
      if (conversation) {
        setConversationId(conversation._id);
        const newMessages = conversation.messages || [];
        
        if (pageNum === 1) {
          setMessages(newMessages);
        } else {
          setMessages(prev => [...newMessages, ...prev]);
        }

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
    if (!socket) return;

    const handleNewMessage = (data) => {
      if (isOpen) {
        setMessages((prev) => [...prev, data.message]);
        fetchConversations();
      }
    };

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on("new_message", handleNewMessage);
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    
    setIsConnected(socket.connected);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [socket, isOpen, fetchConversations]);

  const sendMessage = (payload) => {
    const data = typeof payload === "string" ? { text: payload } : payload;
    const { text, image } = data;

    if (socket && socket.connected) {
      socket.emit("send_message", {
        text: text?.trim(),
        image,
        recipientId: "admin_room",
        conversationId,
      });
    }
  };

  return { messages, isConnected, sendMessage, conversationId, loadMore, hasMore, isLoadingMore };
};
