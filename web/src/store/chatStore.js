import { create } from 'zustand';
import api from '@/lib/api';
import { io } from 'socket.io-client';
import { useAppStore } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';

export const useChatStore = create((set, get) => ({
  conversations: [],
  unreadCount: 0,
  socket: null,
  isLoading: false,

  fetchUnreadCount: async () => {
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
  
  resetUnread: async (conversationId) => {
    try {
      await api.post('/chat/mark-read', { conversationId });
      // Dynamically refetch the most accurate count
      const res = await api.get('/chat/unread-count');
      set({ unreadCount: res.data.count });
    } catch (err) {
      console.error('Failed to mark messages as read', err);
    }
  },

  initSocket: (token) => {
    if (get().socket) return;

    const socketUrl = process.env.NEXT_PUBLIC_API_URL.replace('/api', '');
    console.log('🔌 SOCKET: Initializing socket connection to:', socketUrl);
    
    const socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // ✅ Connection Status Tracking
    socket.on('connect', () => {
      console.log('✅ SOCKET: Connected successfully', { socketId: socket.id });
    });

    socket.on('connect_error', (error) => {
      console.error('❌ SOCKET: Connection error:', error.message);
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 SOCKET: Disconnected -', reason);
    });

    // 💬 Chat Message Listener
    socket.on('new_message', (data) => {
      const { isChatOpen } = useAppStore.getState();
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) return;

      const currentUserRole = currentUser?.role?.name || currentUser?.role;
      const isCurrentUserAdmin = currentUserRole === 'superadmin' || (currentUserRole !== 'customer' && currentUserRole);

      const senderRole = data.message?.sender?.role?.name || data.message?.sender?.role;
      const isFromAdmin = senderRole === 'superadmin' || (senderRole !== 'customer' && senderRole);

      // Do not increment if the message is sent by the current user themselves
      if (data.message?.sender?._id === currentUser._id || data.message?.sender === currentUser._id) {
        return;
      }

      // If admin, notify on customer messages. If customer, notify on admin messages when chat is closed.
      const shouldNotify = isCurrentUserAdmin ? !isFromAdmin : (isFromAdmin && !isChatOpen);
      
      if (shouldNotify) {
        // Refetch total unread count from server for 100% precision
        get().fetchUnreadCount();
      }
    });

    // 🏷️ Order Events Listeners (for admin)
    socket.on('new_order', (order) => {
      console.log('⚡ SOCKET: new_order event received:', order);
    });

    socket.on('order_updated', (data) => {
      console.log('⚡ SOCKET: order_updated event received:', data);
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
