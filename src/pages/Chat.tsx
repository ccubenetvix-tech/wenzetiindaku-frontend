import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import {
  MessageSquare,
  Send,
  ArrowLeft,
  Loader2,
  Search,
  Home,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useChat, ChatMessage, ChatConversation } from "@/contexts/ChatContext";
import { apiClient } from "@/utils/api";
import { getSocket, disconnectSocket } from "@/utils/socket";
import { cn } from "@/lib/utils";

export default function Chat() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated, token } = useAuth();
  const { conversations, unreadCount, isLoading: isLoadingConversations, refreshConversations, markConversationAsRead } = useChat();
  const { toast } = useToast();

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    searchParams.get("conversation") || null
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isInitialConnection, setIsInitialConnection] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const previousConversationIdRef = useRef<string | null>(null);
  const pendingTempMessagesRef = useRef<Map<string, string>>(new Map()); // content -> tempId
  const isLoadingMessagesRef = useRef<boolean>(false); // Prevent duplicate message loads

  const selectedConversation = conversations.find(
    (conv) => conv.id === selectedConversationId
  );

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize WebSocket connection (skip on serverless platforms)
  useEffect(() => {
    if (!isAuthenticated || !token) {
      return;
    }

    // Connect to WebSocket (will return null on serverless platforms)
    const socket = getSocket(token);
    if (!socket) {
      // WebSocket not available (serverless platform) - use REST API only
      setIsConnected(false); // Mark as not connected so we use REST API
      setIsInitialConnection(false); // Don't show loading screen
      socketRef.current = null; // Ensure socket ref is null
      return;
    }

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
      
      // Only show toast if it's been a while (avoid spam)
      const shouldShowError = !isInitialConnection || Date.now() - (socketRef.current?.id ? 0 : Date.now()) > 5000;
      
      if (shouldShowError) {
        toast({
          title: "Connection Error",
          description: error?.message || "Failed to connect to chat server. Trying to reconnect...",
          variant: "destructive",
        });
      }
    });
    
    // Handle socket errors
    socket.on('error', (errorData: { message?: string }) => {
      console.error('WebSocket error:', errorData);
      
      // Check if it's a polling POST error (400 Bad Request) - indicates serverless platform issue
      if (errorData?.message && (
        errorData.message.includes('xhr post error') || 
        errorData.message.includes('400') ||
        errorData.message.includes('Bad Request')
      )) {
        console.warn('Socket.io polling not supported on this platform, will use REST API fallback');
        // Don't show error toast for this - it's expected on serverless platforms
        return;
      }
      
      // Only show toast for non-connection errors (connection errors are handled separately)
      if (errorData?.message && !errorData.message.includes('timeout') && !errorData.message.includes('connection')) {
        toast({
          title: "Chat Error",
          description: errorData.message,
          variant: "destructive",
        });
      }
    });

    // Chat events
    socket.on('new_message', (data: { conversationId: string; message: ChatMessage }) => {
      try {
        // Validate data structure
        if (!data || !data.conversationId || !data.message) {
          console.warn('Invalid new_message data:', data);
          return;
        }
        
        // Validate message structure
        if (!data.message.id || typeof data.message.content !== 'string') {
          console.warn('Invalid message structure:', data.message);
          return;
        }
        
        if (data.conversationId === selectedConversationId) {
          setMessages((prev) => {
            // Check if message already exists (avoid duplicates)
            const exists = prev.some(msg => msg.id === data.message.id);
            if (exists) return prev;
            
            // Check if this is a response to an optimistic update
            const tempId = pendingTempMessagesRef.current.get(data.message.content);
            if (tempId) {
              // Replace the temp message with the real one
              pendingTempMessagesRef.current.delete(data.message.content);
              return prev.map(msg => 
                msg.id === tempId ? data.message : msg
              );
            }
            
            // Remove any temp messages with matching content (fallback)
            const filtered = prev.filter(msg => 
              !(msg.id.startsWith('temp-') && 
                msg.content === data.message.content && 
                msg.senderId === data.message.senderId)
            );
            
            return [...filtered, data.message];
          });
          refreshConversations();
        } else {
          // Update conversation list if message is in another conversation
          refreshConversations();
        }
      } catch (error) {
        console.error('Error handling new_message event:', error);
      }
    });

    socket.on('conversation_updated', () => {
      refreshConversations();
    });

    socket.on('messages_read', (data: { conversationId: string }) => {
      if (data.conversationId === selectedConversationId) {
        // Update read status of messages
        setMessages((prev) =>
          prev.map((msg) =>
            msg.senderId !== user?.id ? { ...msg, isRead: true } : msg
          )
        );
      }
    });

    socket.on('error', (data: { message: string }) => {
      toast({
        title: "Error",
        description: data.message,
        variant: "destructive",
      });
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('connect_error');
        socket.off('new_message');
        socket.off('conversation_updated');
        socket.off('messages_read');
        socket.off('error');
      }
    };
  }, [isAuthenticated, token, selectedConversationId, user?.id, refreshConversations, toast]);

  // Initialize conversation from URL on mount and pre-load conversations
  useEffect(() => {
    // Pre-load conversations immediately (don't wait for WebSocket)
    if (isAuthenticated && user) {
      refreshConversations();
    }
    
    const conversationIdFromUrl = searchParams.get("conversation");
    if (conversationIdFromUrl && conversationIdFromUrl !== selectedConversationId) {
      setSelectedConversationId(conversationIdFromUrl);
    }
  }, [isAuthenticated, user, refreshConversations, searchParams, selectedConversationId]);

  // Note: Conversation updates are already handled by ChatContext (30s polling)
  // No need for additional polling here to avoid duplicate API calls

  // Load messages immediately when conversation is selected (don't wait for WebSocket)
  useEffect(() => {
    if (selectedConversationId) {
      // Load messages immediately (parallel with WebSocket connection)
      loadMessages(selectedConversationId, true);
      markConversationAsRead(selectedConversationId);
      setSearchParams({ conversation: selectedConversationId });
    } else {
      setMessages([]);
      setSearchParams({});
    }
  }, [selectedConversationId, markConversationAsRead]);

  // Join/leave conversation when WebSocket is connected (skip if using REST API)
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !socket.connected || !selectedConversationId) {
      // If no WebSocket, mark as read via REST API
      if (!socket && selectedConversationId) {
        markConversationAsRead(selectedConversationId);
      }
      return;
    }

    // Leave previous conversation if it exists
    if (previousConversationIdRef.current && previousConversationIdRef.current !== selectedConversationId) {
      socket.emit('leave_conversation', { conversationId: previousConversationIdRef.current });
    }

    // Join new conversation
    socket.emit('join_conversation', { conversationId: selectedConversationId });

    // Mark as read via WebSocket
    socket.emit('mark_read', { conversationId: selectedConversationId });
    
    // Update previous conversation ID
    previousConversationIdRef.current = selectedConversationId;

    return () => {
      if (socket && selectedConversationId) {
        socket.emit('leave_conversation', { conversationId: selectedConversationId });
      }
    };
  }, [selectedConversationId, isConnected, markConversationAsRead]);

  // Poll for new messages when using REST API (no WebSocket)
  useEffect(() => {
    // Only poll if:
    // 1. WebSocket is NOT connected
    // 2. WebSocket is NOT available (socketRef.current is null)
    // 3. A conversation is selected
    if (isConnected || socketRef.current || !selectedConversationId) {
      return; // Don't poll if WebSocket is connected or available
    }

    // Poll for new messages every 5 seconds when using REST API
    const pollInterval = setInterval(() => {
      // Double-check conditions before polling
      // Also check if we're not already loading to prevent duplicate calls
      if (!isConnected && !socketRef.current && selectedConversationId && !isLoadingMessagesRef.current) {
        loadMessages(selectedConversationId, false);
      }
    }, 5000); // 5 seconds to reduce API calls

    return () => clearInterval(pollInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversationId, isConnected]);

  const loadMessages = async (conversationId: string, initialLoad = false, retryCount = 0) => {
    const MAX_RETRIES = 3;
    
    // Prevent multiple simultaneous calls for the same conversation
    if (isLoadingMessagesRef.current && initialLoad) {
      return; // Already loading, skip
    }
    
    try {
      if (initialLoad) {
        isLoadingMessagesRef.current = true;
        setIsLoadingMessages(true);
      }
      
      // Validate conversation ID
      if (!conversationId || typeof conversationId !== 'string') {
        throw new Error('Invalid conversation ID');
      }
      
      const response = await apiClient.getChatMessages(conversationId) as {
        success?: boolean;
        data?: { messages?: ChatMessage[] };
        error?: { message?: string };
      };

      if (response?.success && response.data?.messages) {
        // Validate messages array
        const validMessages = (response.data.messages || []).filter(msg => 
          msg && 
          msg.id && 
          typeof msg.content === 'string' &&
          msg.senderId &&
          msg.createdAt
        );
        setMessages(validMessages);
      } else {
        // Handle API error response
        const errorMessage = response?.error?.message || 'Failed to load messages';
        
        // Retry on network errors
        if (retryCount < MAX_RETRIES && (
          errorMessage.includes('timeout') || 
          errorMessage.includes('network') ||
          errorMessage.includes('fetch')
        )) {
          console.log(`Retrying message load (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
          return loadMessages(conversationId, initialLoad, retryCount + 1);
        }
        
        setMessages([]);
        
        if (initialLoad && retryCount >= MAX_RETRIES) {
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      console.error("Failed to load messages:", error);
      
      // Retry on network errors
      if (retryCount < MAX_RETRIES && (
        error?.message?.includes('timeout') || 
        error?.message?.includes('network') ||
        error?.message?.includes('fetch') ||
        error?.message?.includes('Failed to fetch')
      )) {
        console.log(`Retrying message load (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
        return loadMessages(conversationId, initialLoad, retryCount + 1);
      }
      
      setMessages([]);
      
      if (initialLoad) {
        toast({
          title: "Error",
          description: error?.message || "Failed to load messages. Please refresh the page.",
          variant: "destructive",
        });
      }
    } finally {
      if (initialLoad) {
        isLoadingMessagesRef.current = false;
        setIsLoadingMessages(false);
      }
    }
  };

  const sendMessage = async () => {
    // Validate inputs
    if (!messageInput.trim()) {
      toast({
        title: "Invalid Message",
        description: "Message cannot be empty",
        variant: "destructive",
      });
      return;
    }

    if (!selectedConversationId) {
      toast({
        title: "Error",
        description: "No conversation selected",
        variant: "destructive",
      });
      return;
    }

    if (isSendingMessage) {
      return; // Prevent duplicate sends
    }

    // If WebSocket is not available, use REST API (serverless platforms)
    if (!socketRef.current || !socketRef.current.connected) {
      // Use REST API fallback - don't block sending
      console.log('WebSocket not available, using REST API to send message');
    }

    // Validate message length
    if (messageInput.length > 5000) {
      toast({
        title: "Message Too Long",
        description: "Message cannot exceed 5000 characters",
        variant: "destructive",
      });
      return;
    }

    const content = messageInput.trim();
    setMessageInput(""); // Clear input immediately for better UX

    try {
      setIsSendingMessage(true);
      const socket = socketRef.current;

      // Check if WebSocket is available and connected
      // If not, use REST API fallback immediately
      if (!socket || !socket.connected) {
        console.log('WebSocket not available, using REST API fallback');
        const response = await apiClient.sendChatMessage(selectedConversationId, content);
        
        if (response.success && response.data?.message) {
          const newMessage: ChatMessage = {
            id: response.data.message.id,
            content: response.data.message.content,
            senderId: response.data.message.senderId,
            senderRole: response.data.message.senderRole,
            isRead: response.data.message.isRead || false,
            readAt: response.data.message.readAt || null,
            createdAt: response.data.message.createdAt
          };
          
          setMessages((prev) => {
            const exists = prev.some(msg => msg.id === newMessage.id);
            if (exists) return prev;
            return [...prev, newMessage];
          });
          
          refreshConversations();
        } else {
          throw new Error(response.error?.message || 'Failed to send message');
        }
        setIsSendingMessage(false);
        return;
      }

      // Optimistically add message to UI (will be replaced by server response)
      const tempId = `temp-${Date.now()}-${Math.random()}`;
      const tempMessage: ChatMessage = {
        id: tempId,
        content: content,
        senderId: user!.id,
        senderRole: user!.role as 'customer' | 'vendor',
        isRead: false,
        readAt: null,
        createdAt: new Date().toISOString()
      };

      // Track temp message so we can replace it when real message arrives
      pendingTempMessagesRef.current.set(content, tempId);
      
      setMessages((prev) => {
        // Prevent duplicates
        const exists = prev.some(msg => msg.id === tempId || (msg.id.startsWith('temp-') && msg.content === content));
        if (exists) return prev;
        return [...prev, tempMessage];
      });
      
      // Set up error handler for this specific message send
      const errorHandler = async (errorData: { message?: string }) => {
        // Remove optimistic message on error
        setMessages((prev) => prev.filter(msg => msg.id !== tempId));
        pendingTempMessagesRef.current.delete(content);
        
        // Try REST API fallback on WebSocket error
        console.log('WebSocket error, trying REST API fallback:', errorData?.message);
        try {
          const response = await apiClient.sendChatMessage(selectedConversationId, content);
          
          if (response.success && response.data?.message) {
            const newMessage: ChatMessage = {
              id: response.data.message.id,
              content: response.data.message.content,
              senderId: response.data.message.senderId,
              senderRole: response.data.message.senderRole,
              isRead: response.data.message.isRead || false,
              readAt: response.data.message.readAt || null,
              createdAt: response.data.message.createdAt
            };
            
            setMessages((prev) => {
              const exists = prev.some(msg => msg.id === newMessage.id);
              if (exists) return prev;
              return [...prev, newMessage];
            });
            
            refreshConversations();
            
            toast({
              title: "Message sent",
              description: "Message sent via REST API (WebSocket unavailable).",
            });
          } else {
            throw new Error(response.error?.message || 'Failed to send message');
          }
        } catch (fallbackError) {
          // Both WebSocket and REST API failed
          toast({
            title: "Failed to Send",
            description: errorData?.message || "Failed to send message. Please try again.",
            variant: "destructive",
          });
          
          // Restore message input
          setMessageInput(content);
        }
        
        setIsSendingMessage(false);
      };

      // Listen for error for this specific send (one-time)
      socket.once('error', errorHandler);

      // Send message via WebSocket
      socket.emit('send_message', {
        conversationId: selectedConversationId,
        content: content
      });

      // Clean up error handler after 10 seconds (message should have been sent by then)
      setTimeout(() => {
        socket.off('error', errorHandler);
        pendingTempMessagesRef.current.delete(content);
      }, 10000);
    } catch (error: any) {
      console.error("Failed to send message:", error);
      
      // Remove optimistic message
      setMessages((prev) => prev.filter(msg => !msg.id.startsWith('temp-') || msg.content !== content));
      pendingTempMessagesRef.current.delete(content);
      
      toast({
        title: "Error",
        description: error?.message || "Failed to send message. Please check your connection and try again.",
        variant: "destructive",
      });
      
      // Restore message on error
      setMessageInput(content);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      conv.otherParty.name.toLowerCase().includes(query) ||
      conv.otherParty.email.toLowerCase().includes(query)
    );
  });

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  // Handle initial connection state
  useEffect(() => {
    if (isConnected) {
      // Once connected, allow UI to show
      const timer = setTimeout(() => {
        setIsInitialConnection(false);
      }, 500); // Small delay to ensure connection is stable
      return () => clearTimeout(timer);
    }
  }, [isConnected]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current && selectedConversationId) {
        socketRef.current.emit('leave_conversation', { conversationId: selectedConversationId });
      }
    };
  }, []);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please log in to access chat</h1>
            <Button onClick={() => navigate("/customer/login")}>Login</Button>
          </div>
        </div>
      </div>
    );
  }

  if (user.role !== "customer" && user.role !== "vendor") {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Chat is only available for customers and vendors</h1>
            <Button onClick={() => navigate("/")}>Go Home</Button>
          </div>
        </div>
      </div>
    );
  }

  // Show connection timeout after 15 seconds
  const [connectionTimeout, setConnectionTimeout] = useState(false);
  
  useEffect(() => {
    if (isInitialConnection && !isConnected) {
      const timeout = setTimeout(() => {
        setConnectionTimeout(true);
      }, 15000); // 15 seconds
      return () => clearTimeout(timeout);
    } else {
      setConnectionTimeout(false);
    }
  }, [isInitialConnection, isConnected]);

  // Don't show loading screen if WebSocket is disabled (serverless platform)
  const shouldShowLoading = isInitialConnection && isConnected === undefined && token;
  
  if (shouldShowLoading || (connectionTimeout && !isConnected && token)) {
    return (
      <div className="flex h-screen flex-col bg-gray-50 dark:bg-gray-950 overflow-hidden">
        {/* Minimal Professional Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Home className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-navy-600 dark:text-navy-400" />
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Messages</h1>
            </div>
          </div>
        </div>

        {/* Loading State */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md px-4">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-navy-600 dark:text-navy-400 mx-auto" />
              <WifiOff className="h-6 w-6 text-gray-400 absolute top-3 left-1/2 transform -translate-x-1/2" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {connectionTimeout ? 'Connection Timeout' : 'Connecting to chat...'}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {connectionTimeout 
                  ? 'Unable to connect to chat server. Please check your connection and try again.'
                  : 'Please wait while we establish a secure connection'
                }
              </p>
              {connectionTimeout && (
                <div className="space-y-2">
                  <Button 
                    onClick={() => {
                      setConnectionTimeout(false);
                      setIsInitialConnection(true);
                      if (socketRef.current) {
                        socketRef.current.disconnect();
                        socketRef.current = null;
                      }
                      // Force reconnection
                      const newSocket = getSocket(token);
                      if (newSocket) {
                        socketRef.current = newSocket;
                      }
                    }}
                    variant="default"
                  >
                    Retry Connection
                  </Button>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    If this persists, the backend server may be down or WebSocket is not supported on your hosting platform.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {/* Minimal Professional Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Home className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-navy-600 dark:text-navy-400" />
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Messages</h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">{unreadCount}</Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <Wifi className="h-4 w-4" />
              <span className="text-xs">Connected</span>
            </div>
          ) : socketRef.current ? (
            <div className="flex items-center gap-2 text-gray-500">
              <WifiOff className="h-4 w-4" />
              <span className="text-xs">Connecting...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Wifi className="h-4 w-4" />
              <span className="text-xs">REST API</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Conversations Sidebar */}
        <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 dark:border-gray-800 flex flex-col bg-white dark:bg-gray-900">
          {/* Search */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {isLoadingConversations ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3 p-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchQuery ? "No conversations found" : "No conversations yet"}
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversationId(conversation.id)}
                  className={cn(
                    "w-full p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left",
                    selectedConversationId === conversation.id &&
                      "bg-gray-100 dark:bg-gray-800"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarImage
                        src={conversation.otherParty.profilePhoto || undefined}
                        alt={conversation.otherParty.name}
                      />
                      <AvatarFallback className="bg-navy-100 dark:bg-navy-900 text-navy-600 dark:text-navy-400">
                        {conversation.otherParty.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-sm truncate text-gray-900 dark:text-white">
                          {conversation.otherParty.name}
                        </h3>
                        {conversation.lastMessageAt && (
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                            {formatTime(conversation.lastMessageAt)}
                          </span>
                        )}
                      </div>
                      {conversation.unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs mt-1">
                          {conversation.unreadCount} unread
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
          {selectedConversation ? (
            <>
              {/* Conversation Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3 bg-white dark:bg-gray-900">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setSelectedConversationId(null)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={selectedConversation.otherParty.profilePhoto || undefined}
                    alt={selectedConversation.otherParty.name}
                  />
                  <AvatarFallback className="bg-navy-100 dark:bg-navy-900 text-navy-600 dark:text-navy-400">
                    {selectedConversation.otherParty.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-gray-900 dark:text-white truncate">
                    {selectedConversation.otherParty.name}
                  </h2>
                  <p className="text-sm text-gray-500 truncate">{selectedConversation.otherParty.email}</p>
                </div>
              </div>

              {/* Messages */}
              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-950"
              >
                {isLoadingMessages ? (
                  <div className="space-y-3">
                    <div className="flex justify-start">
                      <Skeleton className="h-16 w-3/4 rounded-2xl" />
                    </div>
                    <div className="flex justify-end">
                      <Skeleton className="h-16 w-3/4 rounded-2xl" />
                    </div>
                    <div className="flex justify-start">
                      <Skeleton className="h-16 w-2/3 rounded-2xl" />
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isOwnMessage = message.senderId === user.id;
                    const isTemp = message.id.startsWith('temp-');
                    return (
                      <div
                        key={message.id}
                        className={cn(
                          "flex",
                          isOwnMessage ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[75%] rounded-2xl px-4 py-2 shadow-sm",
                            isOwnMessage
                              ? "bg-navy-600 text-white rounded-br-md"
                              : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md border border-gray-200 dark:border-gray-700",
                            isTemp && "opacity-70"
                          )}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                            {message.content}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={cn(
                                "text-xs",
                                isOwnMessage
                                  ? "text-white/70"
                                  : "text-gray-500"
                              )}
                            >
                              {formatTime(message.createdAt)}
                            </span>
                            {isOwnMessage && (
                              <span
                                className={cn(
                                  "text-xs",
                                  message.isRead
                                    ? "text-white/70"
                                    : "text-white/50"
                                )}
                              >
                                {message.isRead ? "✓✓" : "✓"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className="flex gap-2">
                  <Textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 min-h-[60px] max-h-[120px] resize-none border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-navy-500"
                    rows={2}
                    disabled={!isConnected && socketRef.current !== null}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!messageInput.trim() || isSendingMessage || (!isConnected && socketRef.current !== null)}
                    className="bg-navy-600 hover:bg-navy-700 text-white px-6"
                    size="lg"
                  >
                    {isSendingMessage ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                {!isConnected && socketRef.current && (
                  <p className="text-xs text-gray-500 mt-2">Reconnecting to chat server...</p>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50 dark:bg-gray-950">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
