import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { apiClient } from '../utils/api';
import { useAuth } from './AuthContext';

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderRole: 'customer' | 'vendor';
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface ChatConversation {
  id: string;
  otherParty: {
    id: string;
    name: string;
    email: string;
    profilePhoto: string | null;
  };
  unreadCount: number;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ChatContextType {
  conversations: ChatConversation[];
  unreadCount: number;
  isLoading: boolean;
  refreshConversations: () => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
  markConversationAsRead: (conversationId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  // Return default values if context is not available (graceful degradation)
  if (!context) {
    return {
      conversations: [],
      unreadCount: 0,
      isLoading: false,
      refreshConversations: async () => {},
      refreshUnreadCount: async () => {},
      markConversationAsRead: async () => {},
    };
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const refreshConversations = useCallback(async (retryCount = 0) => {
    const MAX_RETRIES = 3;
    
    if (!isAuthenticated || !user || (user.role !== 'customer' && user.role !== 'vendor')) {
      setConversations([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiClient.getChatConversations() as {
        success?: boolean;
        data?: { conversations?: ChatConversation[] };
        error?: { message?: string };
      };

      if (response?.success && response.data?.conversations) {
        // Validate conversations array
        const validConversations = (response.data.conversations || []).filter(conv => 
          conv && 
          conv.id && 
          conv.otherParty &&
          conv.otherParty.id &&
          conv.otherParty.name
        );
        setConversations(validConversations);
      } else {
        const errorMessage = response?.error?.message || 'Failed to fetch conversations';
        
        // Retry on network errors
        if (retryCount < MAX_RETRIES && (
          errorMessage.includes('timeout') || 
          errorMessage.includes('network') ||
          errorMessage.includes('fetch')
        )) {
          console.log(`Retrying conversations fetch (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
          return refreshConversations(retryCount + 1);
        }
        
        setConversations([]);
      }
    } catch (error: any) {
      console.error('Failed to fetch conversations:', error);
      
      // Retry on network errors
      if (retryCount < MAX_RETRIES && (
        error?.message?.includes('timeout') || 
        error?.message?.includes('network') ||
        error?.message?.includes('fetch') ||
        error?.message?.includes('Failed to fetch')
      )) {
        console.log(`Retrying conversations fetch (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
        return refreshConversations(retryCount + 1);
      }
      
      setConversations([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  const refreshUnreadCount = useCallback(async (retryCount = 0) => {
    const MAX_RETRIES = 2; // Fewer retries for unread count (less critical)
    
    if (!isAuthenticated || !user || (user.role !== 'customer' && user.role !== 'vendor')) {
      setUnreadCount(0);
      return;
    }

    try {
      const response = await apiClient.getChatUnreadCount() as {
        success?: boolean;
        data?: { unreadCount?: number };
        error?: { message?: string };
      };

      if (response?.success && response.data?.unreadCount !== undefined) {
        // Validate unread count is a number
        const count = typeof response.data.unreadCount === 'number' 
          ? Math.max(0, response.data.unreadCount) 
          : 0;
        setUnreadCount(count);
      } else {
        const errorMessage = response?.error?.message || 'Failed to fetch unread count';
        
        // Retry on network errors
        if (retryCount < MAX_RETRIES && (
          errorMessage.includes('timeout') || 
          errorMessage.includes('network') ||
          errorMessage.includes('fetch')
        )) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
          return refreshUnreadCount(retryCount + 1);
        }
        
        setUnreadCount(0);
      }
    } catch (error: any) {
      console.error('Failed to fetch unread count:', error);
      
      // Retry on network errors
      if (retryCount < MAX_RETRIES && (
        error?.message?.includes('timeout') || 
        error?.message?.includes('network') ||
        error?.message?.includes('fetch')
      )) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return refreshUnreadCount(retryCount + 1);
      }
      
      setUnreadCount(0);
    }
  }, [isAuthenticated, user]);

  const markConversationAsRead = useCallback(async (conversationId: string) => {
    // Validate conversation ID
    if (!conversationId || typeof conversationId !== 'string') {
      console.warn('Invalid conversation ID for mark as read:', conversationId);
      return;
    }
    
    try {
      await apiClient.markChatConversationAsRead(conversationId);
      // Optimistically update local state
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
        )
      );
      // Refresh unread count
      await refreshUnreadCount();
    } catch (error: any) {
      console.error('Failed to mark conversation as read:', error);
      // Silently fail - this is not critical for UX
      // The unread count will be corrected on next refresh
    }
  }, [refreshUnreadCount]);

  // Initial load
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshConversations();
      refreshUnreadCount();
    } else {
      setConversations([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated, user, refreshConversations, refreshUnreadCount]);

  // Poll for updates every 30 seconds (only if authenticated)
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    let isMounted = true;

    const interval = setInterval(() => {
      if (isMounted && isAuthenticated && user) {
        refreshConversations();
        refreshUnreadCount();
      }
    }, 30000); // 30 seconds

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isAuthenticated, user, refreshConversations, refreshUnreadCount]);

  const value: ChatContextType = {
    conversations,
    unreadCount,
    isLoading,
    refreshConversations,
    refreshUnreadCount,
    markConversationAsRead,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

