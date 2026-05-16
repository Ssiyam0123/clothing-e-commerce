import { create } from 'zustand';
import api from '@/lib/api';
import { io } from 'socket.io-client';
import { useAppStore } from './appStore';

export const useChatStore = create((set, get) => ({
  conversations: [],
  unreadCount: 0,
  socket: null,
  isLoading: false,

  fetchConversations: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/chat/unread-count');
      set({ unreadCount: res.data.count });
    } catch (error) {
      console.error('📡 Chat Sync Failure Details:', {
        status: error.response?.status,
        message: error.response?.data?.message,
        data: error.response?.data,
        url: error.config?.url
      });
    } finally {
      set({ isLoading: false });
    }
  },

  incrementUnread: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
  
  resetUnread: async () => {
    set({ unreadCount: 0 });
    // Optional: Call backend to mark all as read
    try {
      await api.post('/chat/mark-read');
    } catch (err) {
      console.error('Failed to mark messages as read', err);
    }
  },

  initSocket: (token) => {
    if (get().socket) return;

    const socketUrl = process.env.NEXT_PUBLIC_API_URL.replace('/api', '');
    const socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket'],
    });

    socket.on('new_message', (data) => {
      const { isChatOpen } = useAppStore.getState();
      
      const senderRole = data.message?.sender?.role?.name || data.message?.sender?.role;
      const isFromAdmin = senderRole === 'superadmin' || (senderRole !== 'customer' && senderRole);
      
      if (isFromAdmin && !isChatOpen) {
        get().incrementUnread();
      }
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  }
}));
