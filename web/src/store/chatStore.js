import { create } from 'zustand';
import api from '@/lib/api';
import { io } from 'socket.io-client';

export const useChatStore = create((set, get) => ({
  conversations: [],
  unreadCount: 0,
  socket: null,
  isLoading: false,

  fetchConversations: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/chat/conversations');
      if (res.data.success) {
        const convs = res.data.conversations;
        const unread = convs.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0);
        set({ conversations: convs, unreadCount: unread });
      }
    } catch (err) {
      console.error('📡 Chat Sync Failure:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  initSocket: (token) => {
    if (get().socket) return;

    const socket = io(process.env.NEXT_PUBLIC_API_URL.replace('/api', ''), {
      auth: { token },
      transports: ['websocket'],
    });

    socket.on('new_message', () => {
      get().fetchConversations();
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
