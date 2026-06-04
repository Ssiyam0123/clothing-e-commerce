/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { io, Socket } from 'socket.io-client';
import { ArrowLeft, Send } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { api, API_URL } from '../../lib/api';
import { safeBack } from '../../utils/navigation';

interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
    avatar?: string;
  };
  text: string;
  createdAt: string;
}

export default function LiveSupportChatScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const lang = useAppStore((s) => s.lang);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [conversationId, setConversationId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const scrollViewRef = useRef<ScrollView | null>(null);

  // 1. Load chat history & Initialize socket.io connection
  useEffect(() => {
    if (!token || !user) {
      setLoading(false);
      return;
    }

    const loadHistory = async () => {
      try {
        const { data } = await api.get('/chat/my-conversation');
        if (data) {
          setConversationId(data._id);
          setMessages(data.messages || []);
        }
      } catch (err) {
        console.warn('[ChatHistory] Fetch conversation failed:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();

    // Setup Socket connection
    const socket = io(API_URL, {
      auth: { token },
      transports: ['websocket'],
      forceNew: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('📡 [Chat] Connected to Vanguard Socket Engine');
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('📡 [Chat] Socket disconnected');
      setConnected(false);
    });

    // Listen to new messages
    socket.on('new_message', (data: { message: any; conversationId: string }) => {
      if (data.message) {
        setMessages((prev) => {
          // Prevent duplicates
          if (prev.some((m) => m._id === data.message._id)) return prev;
          return [...prev, data.message];
        });
        
        // Save active conversation id if not set
        if (data.conversationId) {
          setConversationId(data.conversationId);
        }
      }
    });

    socket.on('error_report', (err: any) => {
      console.warn('Socket error report:', err);
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [token, user]);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim() || !socketRef.current) return;

    // Emit send_message event
    socketRef.current.emit('send_message', {
      text: inputText.trim(),
      conversationId: conversationId || undefined, // Send undefined to create a new conversation
    });

    setInputText('');
    scrollToBottom();
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#0F0F11" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header bar */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-zinc-950 border-b border-slate-50 dark:border-zinc-900">
        <Pressable
          onPress={safeBack}
          className="w-9 h-9 items-center justify-center bg-slate-50 dark:bg-zinc-900 rounded-full active:scale-95"
        >
          <ArrowLeft size={18} className="text-foreground" />
        </Pressable>
        <View className="items-center">
          <Text className="text-sm font-black text-foreground italic uppercase tracking-wider">
            Vanguard Support
          </Text>
          <View className="flex-row items-center gap-1 mt-0.5">
            <View className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-500' : 'bg-red-400'}`} />
            <Text className="text-[8px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
              {connected ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>
        <View className="w-9 h-9" />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Messages List */}
        <ScrollView overScrollMode="never"
          ref={scrollViewRef}
          onContentSizeChange={scrollToBottom}
          className="flex-1 px-4 py-3 bg-slate-50/50 dark:bg-zinc-950/20"
        >
          {messages.length === 0 ? (
            <View className="py-12 items-center justify-center">
              <Text className="text-xs font-semibold text-slate-400 dark:text-zinc-500 text-center italic px-10">
                Start a live conversation with our support center. Write a message below!
              </Text>
            </View>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender?._id === user?._id;
              return (
                <View
                  key={msg._id}
                  className={`flex-row mb-3.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <View
                    className={`max-w-[75%] p-3.5 rounded-2xl ${
                      isMe
                        ? 'bg-primary dark:bg-white rounded-tr-none'
                        : 'bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-tl-none'
                    }`}
                  >
                    {!isMe ? (
                      <Text className="text-[8px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
                        {msg.sender?.name || 'Support'}
                      </Text>
                    ) : null}
                    
                    <Text
                      className={`text-sm font-semibold leading-relaxed ${
                        isMe ? 'text-white dark:text-black' : 'text-foreground'
                      }`}
                    >
                      {msg.text}
                    </Text>

                    <Text
                      className={`text-[8px] font-medium text-right mt-1.5 ${
                        isMe ? 'text-white/60 dark:text-black/60' : 'text-slate-400 dark:text-zinc-500'
                      }`}
                    >
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
          <View className="h-6" />
        </ScrollView>

        {/* Input Bar */}
        <View className="p-3 border-t border-slate-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 flex-row gap-3 items-center">
          <TextInput
            placeholder="Type a message..."
            placeholderTextColor="#94A3B8"
            className="flex-1 bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 py-3.5 px-4 rounded-xl text-foreground font-semibold text-sm"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSendMessage}
            blurOnSubmit={false}
          />
          <Pressable
            onPress={handleSendMessage}
            className="w-12 h-12 bg-primary dark:bg-white rounded-xl items-center justify-center active:scale-95"
          >
            <Send size={18} color={Platform.OS === 'web' ? undefined : (useAppStore.getState().theme === 'dark' ? '#000000' : '#FFFFFF')} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
